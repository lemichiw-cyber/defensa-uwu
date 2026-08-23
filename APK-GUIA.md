# 📱 Generar la APK de MiEvento

La app ya es una **PWA completa** (manifest + service worker + iconos).
Hay 3 caminos para obtener la APK — del más fácil al más profesional:

---

## Método 1 — PWABuilder (online, sin instalar nada) ✅ recomendado

1. Publica la app (ej. Vercel) o sirve `dist/` en un dominio con HTTPS
2. Ve a **https://www.pwabuilder.com** y pega la URL
3. Clic en *Package for stores* → **Android**
4. Descarga el ZIP: incluye **APK firmada** (`app-release-signed.apk`) y AAB para Play Store
5. Transfiere la APK al teléfono e instálala (activar "orígenes desconocidos")

> Ventaja: genera APK + AAB + firma, sin Android Studio.

---

## Método 2 — Bubblewrap (CLI de Google)

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://TU-DOMINIO/manifest.webmanifest
bubblewrap build        # genera app-release-signed.apk
```
Requiere JDK 17 (Bubblewrap lo ofrece instalar automáticamente).

---

## Método 3 — Capacitor (WebView nativa, control total)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android          # usa capacitor.config.json ya incluido
npm run build && npx cap sync android
cd android && ./gradlew assembleDebug
# APK en: android/app/build/outputs/apk/debug/app-debug.apk
```
Requiere JDK 17 + Android SDK (Android Studio los instala).

---

## Instalar la PWA directamente (sin APK)

Desde el navegador del teléfono:
1. Abre la app → menú ⋮ → **"Añadir a pantalla de inicio"**
2. Se instala como app independiente: icono propio, pantalla completa,
   sin barra del navegador, funciona offline gracias al service worker.
