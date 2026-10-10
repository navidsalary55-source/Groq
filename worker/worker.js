// Cloudflare Worker — کلیدها فقط اینجا (Variables) نگهداری می‌شوند
// Variables: KAVENEGAR_KEY, SECRET (متن تصادفی)، RESEND_KEY، ADMIN_EMAIL (ایمیل سازنده)، TEMPLATE (اختیاری)
const H={'content-type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type'};
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:H});
const hex=a=>[...a].map(x=>x.toString(16).padStart(2,'0')).join('');
async function sig(env,m){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(m)))}
const gen=async(env,id,b)=>{const s=await sig(env,id+b);return String(((s[0]<<8|s[1])%9000)+1000)};
export default{async fetch(req,env){
  if(req.method=='OPTIONS')return J({});
  const d=await req.json().catch(()=>({})),p=new URL(req.url).pathname,b=Math.floor(Date.now()/300000);
  if(p.startsWith('/admin/')){
    const em=String(d.email||'').trim().toLowerCase(),ok=!!em&&em==String(env.ADMIN_EMAIL||'').toLowerCase();
    if(p=='/admin/send'){
      if(ok){const c=await gen(env,'A'+em,b);
        await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_KEY,'content-type':'application/json'},
          body:JSON.stringify({from:'Bazaar <onboarding@resend.dev>',to:[em],subject:'کد ورود مدیر بازارچه',html:'<p dir="rtl">کد ورود: <b>'+c+'</b></p>'})})}
      return J({ok:true}); // پاسخ یکسان برای ایمیل مجاز و غیرمجاز
    }
    if(p=='/admin/verify'){
      if(ok&&(d.code==await gen(env,'A'+em,b)||d.code==await gen(env,'A'+em,b-1))){const exp=Date.now()+216e5;return J({ok:true,token:exp+'.'+hex(await sig(env,'T'+exp))})}
      return J({ok:false});
    }
    if(p=='/admin/check'){const [e,s]=String(d.token||'').split('.');return J({ok:Number(e)>Date.now()&&s==hex(await sig(env,'T'+e))})}
    return J({ok:false},404);
  }
  const {phone,code}=d;
  if(!/^09\d{9}$/.test(phone||''))return J({ok:false,error:'phone'},400);
  if(p=='/send'){
    const c=await gen(env,phone,b),base=`https://api.kavenegar.com/v1/${env.KAVENEGAR_KEY}/`;
    const url=env.TEMPLATE?`${base}verify/lookup.json?receptor=${phone}&token=${c}&template=${env.TEMPLATE}`
      :`${base}sms/send.json?receptor=${phone}&message=${encodeURIComponent('کد ورود بازارچه: '+c)}`;
    const r=await fetch(url),t=await r.json().catch(()=>({}));return J({ok:r.ok,detail:(t.return&&t.return.message)||''},r.ok?200:502);
  }
  if(p=='/verify')return J({ok:code==await gen(env,phone,b)||code==await gen(env,phone,b-1)});
  return J({ok:false},404);
}}
