Write-Host "CART3R GSM PRO - Windows USB Diagnostics" -ForegroundColor Cyan
Write-Host "`nApple Mobile Device Service:"
Get-Service -Name "Apple Mobile Device Service" -ErrorAction SilentlyContinue | Format-Table Name,Status
Write-Host "`nADB:"
if (Get-Command adb -ErrorAction SilentlyContinue) { adb devices -l } else { Write-Host "ADB nu este instalat sau nu este in PATH." -ForegroundColor Yellow }
Write-Host "`nDispozitive USB prezente:"
Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue |
  Where-Object { $_.Class -in @("USB","AndroidUsbDevice") -or $_.FriendlyName -match "Apple|iPhone|iPad|Android|Samsung" } |
  Select-Object Status,Class,FriendlyName | Format-Table -AutoSize
