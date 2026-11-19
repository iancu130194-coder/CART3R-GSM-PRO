CART3R GSM PRO 4.1 UPDATE
==========================

CE ESTE IN ARHIVA
- index.html: interfața actualizată 4.1, păstrează modulele și fișele locale.
- main.js / preload.js: aplicația Electron și legătura securizată cu Windows.
- windows/check-devices.ps1: diagnostic USB read-only.
- manifest.webmanifest / sw.js: suport PWA.

IMPORTANT
Arhiva conține SURSA, nu un installer EXE gata compilat.
Detectarea Android folosește ADB dacă Android SDK Platform-Tools este instalat și autorizat.
Citirea Apple folosește idevice_id/ideviceinfo dacă libimobiledevice este instalat; instalarea Apple Devices/iTunes asigură driverele Apple, dar nu garantează că aceste utilitare sunt prezente.
Nu se citesc parole, coduri PIN sau date de cont. Nu se elimină Activation Lock.

CUM CONSTRUIEȘTI EXE PE WINDOWS
1. Instalează Node.js LTS de pe https://nodejs.org/
2. Instalează Android SDK Platform-Tools de pe:
   https://developer.android.com/tools/releases/platform-tools
3. (Opțional pentru informații Apple) instalează libimobiledevice pentru Windows și adaugă folderul cu idevice_id.exe și ideviceinfo.exe în PATH.
4. Dezarhivează proiectul într-un folder, de exemplu Desktop\CART3R_GSM_PRO_4_1_UPDATE.
5. Deschide folderul, click în bara de adresă, scrie cmd și Enter.
6. Rulează:
   npm install
   npm run dist
7. Installerul va apărea în folderul dist.

PENTRU ANDROID
- Activează Developer options și USB debugging.
- Conectează telefonul cu un cablu de DATE.
- Deblochează-l și acceptă promptul RSA.
- În CART3R apasă Detectează telefoane USB.

LIMITĂRI
- Un telefon în Recovery/DFU poate să nu ofere informații de model/versiune prin ADB sau libimobiledevice.
- Unele modele/versiuni iOS necesită drivere și servicii Apple compatibile.
- Browserul simplu nu poate face detectare USB completă; folosește aplicația Electron pe Windows.
- Fișele sunt păstrate local în profilul aplicației/browserului. Nu sunt sincronizate între dispozitive.

Folosește numai dispozitive proprii sau pentru care ai autorizare.
