param(
  [string]$Source = "portfolio-shots-upload\detail-04-portfolio-1200x1800.jpg",
  [string]$HeroSource = "portfolio-shots-upload\main-1080x1080.jpg",
  [string]$OutDir = "portfolio-shots-upload\_restore-crops"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Save-Crop($imgPath, $left, $top, $width, $height, $outPath) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $root $imgPath))
  $rect = New-Object System.Drawing.Rectangle($left, $top, $width, $height)
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $enc = New-Object System.Drawing.Imaging.EncoderParameters 1
  $enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92L)
  $bmp.Save((Join-Path $root $outPath), $jpg, $enc)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Output "Saved $outPath"
}

Save-Crop $HeroSource 0 73 1080 1007 "$OutDir\hero-01.jpg"

$crops = @(
  @(24, 468, 368, 490),
  @(416, 468, 368, 490),
  @(808, 468, 368, 490),
  @(24, 978, 368, 490),
  @(416, 978, 368, 490),
  @(808, 978, 368, 490)
)

for ($i = 0; $i -lt $crops.Count; $i++) {
  $c = $crops[$i]
  $n = $i + 1
  Save-Crop $Source $c[0] $c[1] $c[2] $c[3] "$OutDir\portfolio-$n.jpg"
}

Write-Output "Done. Crops in $OutDir"
