$ErrorActionPreference = "SilentlyContinue"
$root = "$env:APPDATA\Cursor\User\globalStorage"
Get-ChildItem $root -Force -ErrorAction SilentlyContinue | ForEach-Object {
  if ($_.PSIsContainer) {
    $sum = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
  } else {
    $sum = $_.Length
  }
  if ($null -ne $sum -and $sum -gt 5MB) {
    Write-Host ("{0,8:N1} MB  {1}" -f ($sum / 1MB), $_.Name)
  }
}
# Top files inside
Get-ChildItem $root -Recurse -File -Force -ErrorAction SilentlyContinue |
  Sort-Object Length -Descending |
  Select-Object -First 25 |
  ForEach-Object {
    Write-Host ("{0,8:N1} MB  {1}" -f ($_.Length / 1MB), $_.FullName.Replace($root + "\", ""))
  }
