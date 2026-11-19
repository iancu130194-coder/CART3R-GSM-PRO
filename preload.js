const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cart3r', {
  detectDevices: () => ipcRenderer.invoke('cart3r:detect'),
  runAdb: (command) => ipcRenderer.invoke('cart3r:adb', command),
  usbCheck: () => ipcRenderer.invoke('cart3r:usbcheck')
});
