Add-Type -AssemblyName System.Drawing

$srcPath = "D:\Powerhub\powerhub\public\images\logo.png"
$destDir = "D:\Powerhub\powerhub\public"

$sizes = @(
    @{ Name = "logo-192.png"; Width = 192; Height = 192 },
    @{ Name = "logo-512.png"; Width = 512; Height = 512 },
    @{ Name = "logo-apple.png"; Width = 180; Height = 180 }
)

if (-not (Test-Path $srcPath)) {
    Write-Error "Source logo not found at $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$srcW = $srcImg.Width
$srcH = $srcImg.Height
$aspect = $srcH / $srcW

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size.Width, $size.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Fill the square background with solid white to blend with the logo's background
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($brush, 0, 0, $size.Width, $size.Height)
    
    # Scale logo to fit 85% of the square's width to leave nice padding
    $targetW = [int]($size.Width * 0.85)
    $targetH = [int]($targetW * $aspect)
    
    # Center the logo horizontally and vertically
    $x = [int](($size.Width - $targetW) / 2)
    $y = [int](($size.Height - $targetH) / 2)
    
    # Use high-quality rendering and scaling modes
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Draw logo on white canvas
    $g.DrawImage($srcImg, $x, $y, $targetW, $targetH)
    
    $outputPath = Join-Path $destDir $size.Name
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    
    Write-Host "Generated $outputPath using website logo"
}

$srcImg.Dispose()
Write-Host "PWA icons updated using website logo."
