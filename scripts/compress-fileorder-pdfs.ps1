param(
  [string]$InputDir = ".\fileorder",
  [string]$OutputDir = ".\fileorder-compressed",
  [ValidateSet("screen", "ebook", "printer", "prepress")]
  [string]$Quality = "ebook"
)

$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$inputPath = Resolve-Path -LiteralPath $InputDir
$outputPath = Join-Path $projectRoot $OutputDir
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$gs = (Get-ChildItem "C:\Program Files\gs" -Recurse -Filter gswin64c.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
if (-not $gs) {
  throw "Cannot find gswin64c.exe. Install Ghostscript first."
}

$workRoot = Join-Path $projectRoot "scratch\dearbook-pdf-compress"
$workIn = Join-Path $workRoot "in"
$workOut = Join-Path $workRoot "out"
New-Item -ItemType Directory -Force -Path $workIn | Out-Null
New-Item -ItemType Directory -Force -Path $workOut | Out-Null

$pdfs = Get-ChildItem -LiteralPath $inputPath -Filter *.pdf
if ($pdfs.Count -eq 0) {
  throw "No PDF files found in $inputPath"
}

$manifest = @()
$index = 1

foreach ($pdf in $pdfs) {
  $safeName = "order-{0:D3}.pdf" -f $index
  $safeInput = Join-Path $workIn $safeName
  $safeOutput = Join-Path $workOut $safeName
  $finalOutput = Join-Path $outputPath ($pdf.BaseName + "-compressed.pdf")

  Copy-Item -LiteralPath $pdf.FullName -Destination $safeInput -Force

  Write-Host ("Compressing {0}/{1}: {2}" -f $index, $pdfs.Count, $pdf.Name)

  $cmd = '"{0}" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/{1} -dNOPAUSE -dBATCH -sOutputFile="{2}" "{3}"' -f `
    $gs, `
    $Quality, `
    $safeOutput, `
    $safeInput

  cmd.exe /d /s /c $cmd

  if ($LASTEXITCODE -ne 0) {
    throw "Ghostscript failed for $($pdf.Name)"
  }

  Copy-Item -LiteralPath $safeOutput -Destination $finalOutput -Force

  $compressed = Get-Item -LiteralPath $finalOutput
  $manifest += [pscustomobject]@{
    OriginalName = $pdf.Name
    OriginalMB = [math]::Round($pdf.Length / 1MB, 2)
    CompressedName = $compressed.Name
    CompressedMB = [math]::Round($compressed.Length / 1MB, 2)
  }

  $index += 1
}

$manifestPath = Join-Path $outputPath "_compression-manifest.csv"
$manifest | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $manifestPath

Write-Host ""
Write-Host "Done. Output folder: $outputPath"
Write-Host "Manifest: $manifestPath"
$manifest | Format-Table -AutoSize
