// Plano3D v248 · guarda la app en el móvil para abrirla sin conexión.
// Con conexión siempre se descarga la versión más nueva (y se guarda); sin conexión se usa la guardada.
const C='plano3d-app';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith((async()=>{const c=await caches.open(C);
    try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),6000);const res=await fetch(r,{signal:ctl.signal,cache:'no-store'});clearTimeout(t);
      if(res&&res.ok){const key=(r.mode==='navigate'||u.pathname.endsWith('/'))?'./index.html':r;c.put(key,res.clone()).catch(()=>{});}return res;}
    catch(err){const m=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('./index.html'):null);if(m)return m;throw err;}})());});
