# git-started

This is a project that I am building to automate the initial setup of a git repo locally and on github.

My initial plan for the structure is as follows:

1. Obtain necessary information:
  - what will the repo name be?
  - accept either a locally exported token or input a token

2. complete the local setup
  - mkdir -p $RepoName
  - echo "# Initial README" >> README.md
  - git init && git add . && git commit -m "init commit"

3. Utilize the github token to create the remote repo in github
  - query the git user
  - utilize pygithub to create the remote

4. Complete the push and verify
  - once remote has been established, git remote set-url to git@github.com... (only use local ssh keys)
  - git push -u origin main
  - verify local output for success or not and let the user know.
