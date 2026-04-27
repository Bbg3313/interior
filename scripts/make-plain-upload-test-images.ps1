Add-Type -AssemblyName System.Drawing

$outDir = "c:\Users\MSI\Desktop\interior-main\portfolio-shots-upload"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

function New-PlainImage($name, $w, $h, $format, $quality = 90) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(245, 245, 245))
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 45, 45))
  $font = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
  $text = "$w x $h"
  $size = $g.MeasureString($text, $font)
  $x = [int](($w - $size.Width) / 2)
  $y = [int](($h - $size.Height) / 2)
  $g.DrawString($text, $font, $brush, $x, $y)

  $path = Join-Path $outDir $name
  if ($format -eq "jpg") {
    $jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
    $bmp.Save($path, $jpgCodec, $encParams)
  } elseif ($format -eq "png") {
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  } else {
    throw "Unsupported format: $format"
  }

  $font.Dispose()
  $brush.Dispose()
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Saved: $path"
}

New-PlainImage "UPLOAD-TEST-800x800.png" 800 800 "png"
New-PlainImage "UPLOAD-TEST-800x800.jpg" 800 800 "jpg" 92
New-PlainImage "UPLOAD-TEST-1200x1200.jpg" 1200 1200 "jpg" 92
