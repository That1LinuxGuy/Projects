const github = "https://github.com";

function cookieValue(request, name) {
  const cookies = request.headers.get("Cookie") || "";
  return cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`))?.[1];
}

function html(message, origin) {
  return new Response(
    `<script>window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(origin)}); window.close();</script>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectUri = `${url.origin}/callback`;

    if (url.pathname === "/auth") {
      const state = crypto.randomUUID();
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: "repo,user",
        state,
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: `${github}/login/oauth/authorize?${params}`,
          "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/`,
        },
      });
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (!code || state !== cookieValue(request, "oauth_state")) {
        return new Response("Invalid OAuth request", { status: 400 });
      }

      const response = await fetch(`${github}/login/oauth/access_token`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });
      const result = await response.json();

      if (!result.access_token) {
        return new Response("GitHub token exchange failed", { status: 400 });
      }

      const message = `authorization:github:success:${JSON.stringify({
        token: result.access_token,
        provider: "github",
      })}`;
      return html(message, env.SITE_ORIGIN);
    }

    return new Response("Decap OAuth provider");
  },
};
