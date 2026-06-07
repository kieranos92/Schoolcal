// SchoolCal service worker — enables "Add to Home Screen" + a basic offline shell.
const CACHE = "schoolcal-v1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache Firebase / Google / EmailJS API calls — always go to network.
  if (url.hostname.includes("googleapis.com") || url.hostname.includes("firebase") || url.hostname.includes("emailjs")) {
    return; // default network behaviour
  }
  // App shell: cache-first, fall back to network.
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html"))));
});
