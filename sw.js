// ============================================================
// sw.js — Service Worker — Consulta Rápida ENF UDP
// Actualizado: 2026-04-08 — v3.0 (dark home, Cincinnati/GSA directos, Cuidados 2 completo)
// ============================================================

const CACHE_NAME = 'consulta-rapida-enf-v3.0';

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './cdss.js',
  './data.js',
  './extras.js',
  // Presentaciones Farmacología
  './antibioticos-slides.html',
  './unidad1-bases-slides.html',
  './unidad2-antiinfecciosos-slides.html',
  './unidad3-cardiovascular-slides.html',
  './unidad4-endocrina-slides.html',
  './unidad5-snc-slides.html',
  './unidad6-digestivo-slides.html',
  // Presentaciones Fisiopatología
  './fisio-u1-celular-slides.html',
  './fisio-u2-respiratoria-slides.html',
  './fisio-u3-cardiovascular-slides.html',
  './fisio-u4-endocrina-slides.html',
  './fisio-u5-renal-slides.html',
  './fisio-u6-neuro-slides.html',
  './fisio-u7-hematologia-slides.html',
  // Presentaciones Cuidados de Enfermería 2
  './cuid2-u1-humanizado-slides.html',
  './cuid2-u2-proceso-slides.html',
  './cuid2-u3-iaas-slides.html',
  './cuid2-u4-tmsv-slides.html',
  './cuid2-u5-calculo-slides.html',
  './cuid2-u6-hidratacion-slides.html',
  './cuid2-u7-eliminacion-slides.html',
  './cuid2-u8-nutricion-slides.html',
  './cuid2-u9-balance-slides.html',
  './cuid2-u10-inhalatoria-slides.html',
  './cuid2-u11-rcp-slides.html',
  './cuid2-u12-visita-slides.html',
  './cuid2-u13-postmortem-slides.html',
  './manifest.json',
  // Íconos PWA
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png'
];

// ── INSTALL: pre-cachear todos los assets ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar cachés antiguas ─────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first, fallback network ──────────────────
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  // No interceptar peticiones a la API de Anthropic (Profe IA)
  if (event.request.url.includes('api.anthropic.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cachear respuestas válidas de mismo origen
        if (
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, clone)
          );
        }
        return response;
      }).catch(() => {
        // Sin red y sin caché: mostrar index como fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
