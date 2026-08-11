$ErrorActionPreference = "SilentlyContinue"
$root = "$env:APPDATA\Cursor"
Write-Host ("C_FREE_GB=" + [math]::Round((Get-PSDrive C).Free / 1GB, 2))
Get-ChildItem $root -Force -ErrorAction SilentlyContinue | ForEach-Object {
  if ($_.PSIsContainer) {
    $sum = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
  } else {
    $sum = $_.Length
  }
  if ($null -ne $sum -and $sum -gt 20MB) {
    Write-Host ("{0,8:N1} MB  {1}" -f ($sum / 1MB), $_.FullName)
  }
}
# Common cache subdirs
$subs = @(
  "Cache", "CachedData", "CachedExtensions", "CachedExtensionVSIXs", "Code Cache",
  "GPUCache", "logs", "Crashpad", "Service Worker", "blob_storage",
  "User\workspaceStorage", "User\History", "User\globalStorage", "User\CachedProfilesData"
)
foreach ($s in $subs) {
  $p = Join-Path $root $s
  if (Test-Path $p) {
    $sum = (Get-ChildItem $p -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    Write-Host ("{0,8:N1} MB  {1}" -f ($sum / 1MB), $p)
  }
}
