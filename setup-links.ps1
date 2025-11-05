# Setup proper symlinks for development
Write-Host "Setting up development links..."

# Remove existing node_modules link if it exists
cd c:\www\contract-cancellation-app
if (Test-Path "node_modules\@pfp\frontend-platform") {
    Remove-Item -Path "node_modules\@pfp\frontend-platform" -Recurse -Force -ErrorAction SilentlyContinue
}

# Create proper directory structure
New-Item -ItemType Directory -Path "node_modules\@pfp" -Force -ErrorAction SilentlyContinue

# Create junction (Windows symlink) to the built library
cmd /c mklink /J "node_modules\@pfp\frontend-platform" "..\..\pfp-frontend-platform"

Write-Host "Links created successfully!"
Write-Host "Remember to build the platform library first with: cd ..\pfp-frontend-platform && yarn build"
