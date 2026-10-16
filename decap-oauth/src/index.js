const github = "https://github.com";

function cookieValue(request, name) {
  const cookies = request.headers.get("Cookie") || "";
  return cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`))?.[1];
}

function html(message, origin) {
  // Decap's NetlifyAuthenticator requires a two-message handshake: it
  // registers the success listener only after acknowledging "authorizing".
  const script = `<script>
    const siteOrigin = ${JSON.stringify(origin)};
    window.addEventListener("message", function onHandshake(event) {
      if (event.source !== window.opener || event.origin !== siteOrigin ||
          event.data !== "authorizing:github") return;
      window.removeEventListener("message", onHandshake);
      window.opener.postMessage(${JSON.stringify(message)}, siteOrigin);
      window.close();
    });
    if (window.opener) {
      window.opener.postMessage("authorizing:github", siteOrigin);
    } else {
      document.body.textContent = "Login window was not opened by Decap CMS. Please retry from /admin/.";
    }
  </script>`;
  return new Response(script, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
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

      const tokenBody = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      });
      const response = await fetch(`${github}/login/oauth/access_token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "melodee-decap-oauth",
        },
        body: tokenBody,
      });
      const result = await response.json();

      if (!result.access_token) {
        console.error("GitHub token exchange failed", {
          status: response.status,
          error: result.error,
          description: result.error_description,
        });
        return new Response(
          `GitHub token exchange failed: ${result.error_description || result.error || "unknown error"}`,
          { status: 400 },
        );
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
