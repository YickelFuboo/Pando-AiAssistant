$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")
$backendDir = Join-Path $rootDir "backend"
$distDir = Join-Path $backendDir "dist"
$buildDir = Join-Path $backendDir "build"
$specFile = Join-Path $backendDir "pando-backend.spec"

if (-not (Test-Path $backendDir)) {
    throw "backend directory not found: $backendDir"
}

if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    throw "poetry not found in PATH."
}

Write-Host "[backend] install dependencies..."
Push-Location $backendDir
try {
    poetry install

    Write-Host "[backend] ensure pyinstaller..."
    poetry run pip install pyinstaller

    if (Test-Path $distDir) {
        Remove-Item $distDir -Recurse -Force
    }
    if (Test-Path $buildDir) {
        Remove-Item $buildDir -Recurse -Force
    }
    if (Test-Path $specFile) {
        Remove-Item $specFile -Force
    }

    Write-Host "[backend] build exe..."
    poetry run pyinstaller --name pando-backend --onefile --paths . app/main.py
}
finally {
    Pop-Location
}

Write-Host "[backend] done."
