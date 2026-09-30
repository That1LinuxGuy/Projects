import subprocess
import os
import sys
from contextlib import contextmanager

REPO_DIR_PREFIX = "" # Base directory for repos

def run_command(command_parts, check=True):
    """Runs a shell command using subprocess.run and checks for errors."""
    try:
        # Pass capture_output=True and text=True to capture stdout/stderr as strings
        result = subprocess.run(command_parts, check=check, capture_output=True, text=True)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {' '.join(command_parts)}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: Required executable (like git) not found. Is Git installed and in PATH?")
        sys.exit(1)

@contextmanager
def change_directory(new_dir):
    """Context manager to safely change and return to the original working directory."""
    original_cwd = os.getcwd()
    try:
        os.chdir(new_dir)
        yield
    finally:
        os.chdir(original_cwd)

def initialize_local_repo(repo_name):
    """Step 2: Initialize the local Git repository."""
    print(f"--- Starting local setup for '{repo_name}' ---")

    # 1. Setup directory and README
    if not os.path.exists(repo_name):
        os.makedirs(repo_name)
        print(f"Created directory: {repo_name}")
    
    readme_path = os.path.join(repo_name, "README.md")
    with open(readme_path, "w") as f:
        f.write("# Initial README\n")
    print(f"Created README.md in {repo_name}")

    # 2. Git Initialization and First Commit
    with change_directory(repo_name):
        print("Running git init and adding files...")
        
        # git init
        run_command(["git", "init"])
        
        # git add .
        run_command(["git", "add", "."])
        
        # git commit
        commit_msg = f"Initial commit of {repo_name}"
        run_command(["git", "commit", "-m", commit_msg])
        
    print("Local repository initialization successful.")


def setup_remote_and_push(repo_name, github_token):
    """
    Step 3 & 4: (SKELETON) This function needs to be fully implemented
    to handle GitHub API calls for remote creation, but we simulate the process here.
    """
    print("\n--- Starting GitHub Remote Setup ---")
    if github_token == "<YOUR_TOKEN>":
        print("SECURITY WARNING: GitHub Token was not provided. Skipping remote setup.")
        # In a real scenario, this failure would be critical.
        return

    # TODO: Implement calls to GitHub REST API here using the token
    # to create a remote repository for 'repo_name'.
    print(f"SUCCESS: Mocking GitHub remote creation for {repo_name}.")

    # --- Simulating successful remote URL fetching ---
    # Assume API call succeeds and returns the canonical URL
    remote_url = f"git@github.com:user/{repo_name}.git" 
    
    print(f"Setting remote origin to: {remote_url}")
    
    # Set remote origin
    with change_directory(repo_name):
        run_command(["git", "remote", "set-url", "origin", remote_url])
        
        # Push
        print("Attempting to push to remote...")
        # Note: Push often requires the remote to be pre-configured or authentication to work perfectly here.
        # For a real sequence, you might need to configure SSH keys or use HTTPS credentials.
        run_command(["git", "push", "-u", "origin", "main"])
        print("\nSuccessfully pushed to the remote repository.")


def main():
    # --- Step 1: Get user input (Secured slightly by default values) ---
    repo_name = input("Enter repository name: ")
    if not repo_name:
        print("Repository name cannot be empty.")
        return

    # SECURITY NOTE: For production, reading the token from an environment variable is vastly superior.
    github_token = input("Enter GitHub Personal Access Token (Optional): ")
    if not github_token:
        github_token = "<YOUR_TOKEN>" # Defaulting if input is empty

    try:
        # Step 2: Local setup
        initialize_local_repo(repo_name)

        # Step 3 & 4: Remote setup (Placeholder/Skeleton)
        setup_remote_and_push(repo_name, github_token)

    except Exception as e:
        print(f"\n[FATAL ERROR] An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()