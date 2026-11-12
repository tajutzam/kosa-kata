// Cache hanya aset aplikasi sendiri; tidak menyimpan halaman autentikasi.
const CACHE='kantong-kata-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{for(const path of ASSETS){const response=await fetch(path,{cache:'reload'});if(!response.ok||response.redirected)throw Error('Aset offline belum tersedia');await cache.put(path,response)}await self.skipWaiting()})));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('kantong-kata-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return}event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)))});
