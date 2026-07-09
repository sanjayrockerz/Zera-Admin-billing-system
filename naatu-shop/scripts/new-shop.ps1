param(
  [Parameter(Mandatory=$true)]
  [string]$ShopName,

  [Parameter(Mandatory=$true)]
  [string]$ShopNameTamil,

  [Parameter(Mandatory=$true)]
  [string]$ShopPhone,  # e.g. "+91 9876543210"

  [Parameter(Mandatory=$true)]
  [string]$ShopPhoneE164,  # e.g. "919876543210"

  [string]$SupabaseUrl = "",
  [string]$SupabaseAnonKey = "",
  [string]$ShopEmail = "",
  [string]$ShopAddress = "",
  [string]$Subtitle = "Admin Dashboard",

  [string]$MaroonHex = "#8B1C31",
  [string]$MaroonDarkHex = "#601424",

  [string]$NewRepoDir = ""
)

# ── CONVERT SHORT NAME ──
$ShortName = $ShopName -replace '\s+', ''  # e.g. "MyStore"
$ShortNameLower = $ShortName.ToLower()
$ShortNameUpper = $ShortName.ToUpper()
$ShopNameUpper = $ShopName.ToUpper()

if ([string]::IsNullOrEmpty($ShopEmail)) { $ShopEmail = "admin@${ShortNameLower}.local" }
if ([string]::IsNullOrEmpty($ShopAddress)) { $ShopAddress = "Update with your business address" }
if ([string]::IsNullOrEmpty($NewRepoDir)) { $NewRepoDir = "$PSScriptRoot\..\..\..\$ShortNameLower-admin" }

Write-Host "═══ NEW SHOP SETUP ═══" -ForegroundColor Cyan
Write-Host "Shop Name:     $ShopName"
Write-Host "Short Name:    $ShortName"
Write-Host "Phone:         $ShopPhone"
Write-Host "Supabase URL:  $SupabaseUrl"
Write-Host "Output Dir:    $NewRepoDir"
Write-Host ""

# ── 1. COPY the entire naatu-shop directory ──
Write-Host "[1/6] Copying project to $NewRepoDir ..." -ForegroundColor Yellow
$SourceDir = Resolve-Path "$PSScriptRoot\.."
if (Test-Path $NewRepoDir) {
  Write-Host "  ⚠ Target exists, removing..." -ForegroundColor Yellow
  Remove-Item -Recurse -Force $NewRepoDir
}
Copy-Item -Recurse -Path $SourceDir -Destination $NewRepoDir
Write-Host "  ✔ Copied" -ForegroundColor Green

# ── 2. Update brand.ts ──
Write-Host "[2/6] Updating brand.ts ..." -ForegroundColor Yellow
$BrandFile = "$NewRepoDir\src\lib\brand.ts"
$BrandContent = @"
export const BRAND_EN = '$ShopName'
export const BRAND_TA = '$ShopNameTamil'
export const BRAND_SUBTITLE = '$Subtitle'

export const BRAND_PRIMARY_PHONE_DISPLAY = '$ShopPhone'
export const BRAND_PRIMARY_PHONE_E164 = '$ShopPhoneE164'
export const BRAND_SECONDARY_PHONE_DISPLAY = '$ShopPhone'
export const BRAND_SECONDARY_PHONE_E164 = '$ShopPhoneE164'
export const BRAND_THIRD_PHONE_DISPLAY = '$ShopPhone'
export const BRAND_THIRD_PHONE_E164 = '$ShopPhoneE164'
export const BRAND_PHONE_DISPLAY = BRAND_PRIMARY_PHONE_DISPLAY
export const BRAND_PHONE_E164 = BRAND_PRIMARY_PHONE_E164
export const BRAND_WHATSAPP = BRAND_THIRD_PHONE_DISPLAY
export const WHATSAPP_NUM = BRAND_THIRD_PHONE_E164
export const BRAND_WHATSAPP_LINK = 'https://wa.me/${ShopPhoneE164}'
export const BRAND_EMAIL = '$ShopEmail'
export const BRAND_ADDRESS = '$ShopAddress'
export const BRAND_LOCATION_LINK = '#'
"@
Set-Content -Path $BrandFile -Value $BrandContent -Encoding UTF8
Write-Host "  ✔ brand.ts updated" -ForegroundColor Green

# ── 3. Update index.html ──
Write-Host "[3/6] Updating index.html ..." -ForegroundColor Yellow
$IndexFile = "$NewRepoDir\index.html"
(Get-Content $IndexFile -Raw) -replace 'Zera Admin Billing \| Admin Dashboard Template', "$ShopName | $Subtitle" `
  -replace 'Zera Admin Billing is a reusable admin dashboard template', "$ShopName is a $Subtitle" `
  -replace '"Zera Admin Billing"', '"$ShopName"' `
  -replace '/zera-logo\.png', '/$($ShortNameLower)-logo.png' `
  -replace 'favicon\.jpg', 'favicon.jpg' `
  | Set-Content $IndexFile -Encoding UTF8
Write-Host "  ✔ index.html updated" -ForegroundColor Green

# ── 4. Update .env.example ──
Write-Host "[4/6] Updating .env.example ..." -ForegroundColor Yellow
$EnvFile = "$NewRepoDir\.env.example"
(Get-Content $EnvFile -Raw) `
  -replace 'VITE_SUPABASE_URL=.*', "VITE_SUPABASE_URL=$SupabaseUrl" `
  -replace 'VITE_SUPABASE_ANON_KEY=.*', "VITE_SUPABASE_ANON_KEY=$SupabaseAnonKey" `
  -replace 'VITE_WHATSAPP_NUMBER=.*', "VITE_WHATSAPP_NUMBER=$ShopPhoneE164" `
  -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://localhost:5000/api' `
  | Set-Content $EnvFile -Encoding UTF8
Write-Host "  ✔ .env.example updated" -ForegroundColor Green

# ── 5. Update all ZERA references in source files ──
Write-Host "[5/6] Replacing brand references in source files ..." -ForegroundColor Yellow

$Replacements = @(
  # store/store.ts
  @{File="$NewRepoDir\src\store\store.ts"; Old='"SRI SIDDHA HERBAL STORE - CORE STATE MANAGEMENT"'; New="`"$ShopNameUpper - CORE STATE MANAGEMENT`""},
  @{File="$NewRepoDir\src\store\store.ts"; Old="'sri-siddha-auth'"; New="'$($ShortNameLower)-auth'"},
  @{File="$NewRepoDir\src\store\store.ts"; Old="'sri-siddha-cart'"; New="'$($ShortNameLower)-cart'"},
  @{File="$NewRepoDir\src\store\store.ts"; Old="'sri-siddha-favorites'"; New="'$($ShortNameLower)-favorites'"},
  @{File="$NewRepoDir\src\store\store.ts"; Old="name: 'ZERA'"; New="name: '$ShopNameUpper'"},
  @{File="$NewRepoDir\src\store\store.ts"; Old="ownerName: 'Sulficker Roshan N'"; New="ownerName: '$ShopName'"},

  # store/langStore.ts
  @{File="$NewRepoDir\src\store\langStore.ts"; Old="'srisiddha-lang'"; New="'$($ShortNameLower)-lang'"},

  # lib/ordersFallback.ts
  @{File="$NewRepoDir\src\lib\ordersFallback.ts"; Old="'siddha_orders'"; New="'$($ShortNameLower)_orders'"},

  # services/authService.ts
  @{File="$NewRepoDir\src\services\authService.ts"; Old="'siddha_users'"; New="'$($ShortNameLower)_users'"},
  @{File="$NewRepoDir\src\services\authService.ts"; Old="'siddha_session'"; New="'$($ShortNameLower)_session'"},

  # services/api.ts
  @{File="$NewRepoDir\src\services\api.ts"; Old="'srisiddha-token'"; New="'$($ShortNameLower)-token'"},

  # constants/business.ts
  @{File="$NewRepoDir\src\constants\business.ts"; Old="BUSINESS_PHONE = "; New="BUSINESS_PHONE = '$ShopPhoneE164'"; IgnoreSource=@{"919514626063"=$ShopPhoneE164}},

  # translations/en.json
  @{File="$NewRepoDir\src\translations\en.json"; Old="Tirupathi Balaji Herbal Store"; New="$ShopName"},
  @{File="$NewRepoDir\src\translations\en.json"; Old="Cenexa Systems"; New="$ShopName"},

  # Home.tsx references
  @{File="$NewRepoDir\src\pages\Home.tsx"; Old="'siddha_customer_reviews'"; New="'$($ShortNameLower)_customer_reviews'"},
  @{File="$NewRepoDir\src\pages\Home.tsx"; Old="'Siddha Remedies'"; New="'$ShopName Remedies'"},

  # data/galleryImages.ts
  @{File="$NewRepoDir\src\data\galleryImages.ts"; Old="Tirupathi Balaji Herbal Store"; New="$ShopName"},

  # dashboard/ImageMappingTool.ts
  @{File="$NewRepoDir\src\components\dashboard\ImageMappingTool.ts"; Old="'naatu-shop-image-mappings'"; New="'$($ShortNameLower)-image-mappings'"},
)

# Simple text replacements across all source files
$SourceFiles = Get-ChildItem "$NewRepoDir\src" -Recurse -Include *.ts,*.tsx | Where-Object { -not $_.FullName.Contains('\node_modules\') }
$Count = 0
foreach ($file in $SourceFiles) {
  $content = Get-Content $file.FullName -Raw
  $modified = $false

  $content = $content -replace 'Zera Admin Billing', $ShopName
  if ($content -ne (Get-Content $file.FullName -Raw)) { $modified = $true }

  $content = $content -replace 'zera-logo\.png', "$($ShortNameLower)-logo.png"
  if ($content -cne (Get-Content $file.FullName -Raw)) { $modified = $true }

  $content = $content -replace '/zera\.png', "/$($ShortNameLower).png"
  if ($content -cne (Get-Content $file.FullName -Raw)) { $modified = $true }

  if ($modified) {
    Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
    $Count++
  }
}

Write-Host "  ✔ Replaced brand references in $Count files" -ForegroundColor Green

# ── 6. Rename logo assets ──
Write-Host "[6/6] Renaming logo assets ..." -ForegroundColor Yellow
$OldLogo = "$NewRepoDir\public\zera-logo.png"
$NewLogo = "$NewRepoDir\public\$($ShortNameLower)-logo.png"
if (Test-Path $OldLogo) { Rename-Item $OldLogo $NewLogo; Write-Host "  ✔ Logo renamed" -ForegroundColor Green }

# Copy a placeholder favicon (keep the same image, just rename conceptually)
Write-Host "  ✔ Assets ready" -ForegroundColor Green

# ── Init git for the new project ──
Write-Host "`n═══ INITIALIZING NEW REPO ═══" -ForegroundColor Cyan
if (Test-Path "$NewRepoDir\.git") {
  Remove-Item -Recurse -Force "$NewRepoDir\.git"
}
Set-Location $NewRepoDir
git init
git add -A
git commit -m "Initial commit: $ShopName admin billing system"

Write-Host "`n╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  NEW SHOP READY                                     ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Shop: $ShopName" -ForegroundColor Green
Write-Host "║  Location: $NewRepoDir" -ForegroundColor Green
Write-Host "║                                                      ║" -ForegroundColor Green
Write-Host "║  To finish:                                          ║" -ForegroundColor Green
Write-Host "║  1. Set your actual Supabase credentials in .env     ║" -ForegroundColor Green
Write-Host "║  2. Replace public/$($ShortNameLower)-logo.png with your logo   ║" -ForegroundColor Green
Write-Host "║  3. Update tailwind.config.js theme colors if needed ║" -ForegroundColor Green
Write-Host "║  4. Push to your new GitHub repo:                    ║" -ForegroundColor Green
Write-Host "║     git remote add origin <your-new-repo-url>       ║" -ForegroundColor Green
Write-Host "║     git push -u origin main                          ║" -ForegroundColor Green
Write-Host "║  5. Deploy on Vercel: import new repo,               ║" -ForegroundColor Green
Write-Host "║     add env vars, deploy                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green

Set-Location $PSScriptRoot\..
