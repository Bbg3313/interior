Add-Type -AssemblyName System.Drawing

$source = "c:\Users\MSI\Desktop\interior-main\portfolio-shots\landing-full-for-crop.png"
$image = [System.Drawing.Image]::FromFile($source)

# "최근 완료된 프리미엄 공간" 타이틀 + 포트폴리오 카드가 함께 보이도록 Y를 조정
$cropY = 1180
$cropWidth = 1200
$cropHeight = 1200

$bitmap = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.DrawImage(
  $image,
  (New-Object System.Drawing.Rectangle 0, 0, $cropWidth, $cropHeight),
  (New-Object System.Drawing.Rectangle 0, $cropY, $cropWidth, $cropHeight),
  [System.Drawing.GraphicsUnit]::Pixel
)

$out = "c:\Users\MSI\Desktop\interior-main\portfolio-shots\01-main-1200x1200-portfolio-visible.png"
$bitmap.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$image.Dispose()

Write-Output "Saved: $out"
