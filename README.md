# بازارچه کسب و کار آنلاین

ساختار:
- www/index.html  ← خود اپ (ADMIN/API/SMS/CT در بالای اسکریپت)
- worker/worker.js ← Cloudflare Worker (ورود مدیر با ایمیل + پیامک)
- assets/ ← آیکون اپ (icon-legacy.png) و عکس اصلی سبد خرید
- scripts/icons.js ← جایگزینی آیکون در ساخت
- debug.keystore ← امضای ثابت (نصب روی نسخه‌ی قبلی بدون پاک کردن)
- .github/workflows/build-apk.yml ← ساخت APK

ساخت APK: همه‌ی فایل‌ها (با پوشه‌ی .github) در GitHub، سپس Actions > Build APK > Artifacts > app-debug.
اگر قبلاً نسخه‌ای با امضای دیگر نصب بوده، یک بار اپ را پاک کنید.
