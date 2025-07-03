# PowerShell script to fix gitignore issues by removing tracked files from git cache

# First, rename the new gitignore file to the main one
Copy-Item -Path ".gitignore.new" -Destination ".gitignore" -Force

# Remove all files from git cache
git rm -r --cached .

# Re-add all files (this will respect the new .gitignore)
git add .

Write-Host "Git cache has been cleared and files have been re-added according to the new .gitignore file."
Write-Host "Now you can commit these changes with: git commit -m 'Fixed gitignore issues'"
