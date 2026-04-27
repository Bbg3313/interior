Add-Type -AssemblyName System.Drawing

$src = "c:\Users\MSI\Desktop\interior-main\portfolio-shots-upload\main-1080x1080.jpg"
$outDir = "c:\Users\MSI\Desktop\interior-main\portfolio-shots-upload"

$img = [System.Drawing.Image]::FromFile($src)

function Save-SquareJpeg($size, $quality, $name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $size, $size)

  $jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
  $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $path = Join-Path $outDir $name
  $bmp.Save($path, $jpgCodec, $encParams)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Saved: $path"
}

function Save-SquarePng($size, $name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $size, $size)
  $path = Join-Path $outDir $name
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Saved: $path"
}

Save-SquareJpeg 800 92 "main-FALLBACK-800x800-q92.jpg"
Save-SquareJpeg 700 90 "main-FALLBACK-700x700-q90.jpg"
Save-SquarePng 800 "main-FALLBACK-800x800.png"
Save-SquarePng 600 "main-FALLBACK-600x600.png"

$img.Dispose()
