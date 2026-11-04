const CACHE='apice-2026-11-03-1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname==='api.github.com') return;
  const libs=/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com|img\.youtube\.com/.test(u.hostname);
  if(libs){e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;}))));return;}
  if(u.origin===self.location.origin){e.respondWith(fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request.url.split('?')[0],cp));}return n;}).catch(()=>caches.match(e.request.url.split('?')[0]).then(r=>r||caches.match('index.html')))));}
});
