// ICON-V3 — جایگزینی کامل آیکون اپ + گزارش در لاگ
const fs=require('fs'),path=require('path');
const res='android/app/src/main/res',man='android/app/src/main/AndroidManifest.xml';
if(!fs.existsSync(res)||!fs.existsSync(man)){console.log('ICON-V3: no android project');process.exit(1)}
const dens=['mipmap-mdpi','mipmap-hdpi','mipmap-xhdpi','mipmap-xxhdpi','mipmap-xxxhdpi'];
for(const d of dens){
  fs.mkdirSync(path.join(res,d),{recursive:true});
  for(const n of ['bazaar_icon','ic_launcher','ic_launcher_round'])
    fs.copyFileSync('assets/icon-legacy.png',path.join(res,d,n+'.png'));
}
// حذف تعریف‌های آیکون تطبیقی و ربات پیش‌فرض
for(const f of ['mipmap-anydpi-v26/ic_launcher.xml','mipmap-anydpi-v26/ic_launcher_round.xml','drawable-v24/ic_launcher_foreground.xml','drawable/ic_launcher_background.xml']){
  try{fs.unlinkSync(path.join(res,f))}catch(e){}
}
let m=fs.readFileSync(man,'utf8');
m=m.replace(/android:icon="[^"]*"/,'android:icon="@mipmap/bazaar_icon"');
if(/android:roundIcon="/.test(m))m=m.replace(/android:roundIcon="[^"]*"/,'android:roundIcon="@mipmap/bazaar_icon"');
else m=m.replace('<application','<application android:roundIcon="@mipmap/bazaar_icon"');
fs.writeFileSync(man,m);
console.log('ICON-V3 manifest:',(m.match(/android:(icon|roundIcon)="[^"]*"/g)||[]).join(' '));
console.log('ICON-V3 files:',fs.readdirSync(path.join(res,'mipmap-xxhdpi')).join(', '));
console.log('ICON-V3 replaced');
