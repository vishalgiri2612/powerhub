Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\visha\.gemini\antigravity-ide\brain\1550346a-b690-45b8-8a59-d7c655972b3d\ravtron_pwa_icon_1782464007450.png"
$destDir = "D:\Powerhub\powerhub\public"

$sizes = @(
    @{ Name = "icon-192.png"; Width = 192; Height = 192 },
    @{ Name = "icon-512.png"; Width = 512; Height = 512 },
    @{ Name = "apple-touch-icon.png"; Width = 180; Height = 180 }
)

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found at $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size.Width, $size.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Set high quality resizing options
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $g.DrawImage($srcImg, 0, 0, $size.Width, $size.Height)
    
    $outputPath = Join-Path $destDir $size.Name
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    
    Write-Host "Generated $outputPath"
}

$srcImg.Dispose()
Write-Host "PWA icons generation complete."
