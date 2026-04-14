$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")
$frontendDir = Join-Path $rootDir "frontend"

if (-not (Test-Path $frontendDir)) {
    throw "frontend directory not found: $frontendDir"
}

Write-Host "[frontend] install dependencies..."
Push-Location $frontendDir
try {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install --frozen-lockfile
        Write-Host "[frontend] build with pnpm..."
        pnpm run build
    }
    elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm ci
        Write-Host "[frontend] build with npm..."
        npm run build
    }
    else {
        throw "Neither pnpm nor npm found in PATH."
    }
}
finally {
    Pop-Location
}

Write-Host "[frontend] done."
