$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")

$frontendDistDir = Join-Path $rootDir "frontend/dist"
$backendExe = Join-Path $rootDir "backend/dist/pando-backend.exe"
$releaseDir = Join-Path $rootDir "release"
$releaseBackendDir = Join-Path $releaseDir "backend"
$releaseFrontendDir = Join-Path $releaseDir "frontend"
$releaseConfigDir = Join-Path $releaseDir "config"

if (-not (Test-Path $frontendDistDir)) {
    throw "frontend dist not found: $frontendDistDir. Please run scripts/build_frontend.ps1 first."
}

if (-not (Test-Path $backendExe)) {
    throw "backend exe not found: $backendExe. Please run scripts/build_backend.ps1 first."
}

if (Test-Path $releaseDir) {
    Remove-Item $releaseDir -Recurse -Force
}

New-Item -ItemType Directory -Path $releaseBackendDir | Out-Null
New-Item -ItemType Directory -Path $releaseFrontendDir | Out-Null
New-Item -ItemType Directory -Path $releaseConfigDir | Out-Null

Copy-Item $backendExe $releaseBackendDir
Copy-Item (Join-Path $frontendDistDir "*") $releaseFrontendDir -Recurse

$envExample = Join-Path $rootDir "backend/.env.example"
if (Test-Path $envExample) {
    Copy-Item $envExample (Join-Path $releaseConfigDir "backend.env.example")
}

$startBat = @'
@echo off
setlocal

set ROOT=%~dp0
set BACKEND_EXE=%ROOT%backend\pando-backend.exe

if not exist "%BACKEND_EXE%" (
  echo backend exe not found: %BACKEND_EXE%
  exit /b 1
)

echo Starting backend...
start "pando-backend" "%BACKEND_EXE%"

echo.
echo Frontend files are in: %ROOT%frontend
echo Deploy frontend dist with nginx or any static web server.
echo.
echo Done.
exit /b 0
'@

Set-Content -Path (Join-Path $releaseDir "start.bat") -Value $startBat -Encoding Ascii

Write-Host "[release] packaged at: $releaseDir"
