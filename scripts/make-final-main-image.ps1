Add-Type -AssemblyName System.Drawing

$src = "c:\Users\MSI\Desktop\interior-main\portfolio-shots-upload\main-1080x1080.jpg"
$out = "c:\Users\MSI\Desktop\interior-main\portfolio-shots-upload\main-FINAL-1200x1200.jpg"

$img = [System.Drawing.Image]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap 1200, 1200
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, 1200, 1200)

$jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95L)

$bmp.Save($out, $jpgCodec, $encParams)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Output "Saved: $out"
