const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

function run(file, args, timeout=12000) {
  return new Promise(resolve => {
    execFile(file, args, { windowsHide:true, timeout, maxBuffer:2*1024*1024 }, (error, stdout, stderr) => {
      resolve({ ok:!error, output:(stdout||'').trim(), error:error ? ((stderr||error.message||'Comanda a eșuat').trim()) : '' });
    });
  });
}
function findExe(names) {
  const pathDirs=(process.env.PATH||'').split(path.delimiter);
  for (const dir of pathDirs) for (const name of names) {
    const p=path.join(dir,name);
    try { require('fs').accessSync(p); return p; } catch {}
  }
  return null;
}
async function detectDevices() {
  const devices=[];
  const adb=findExe(['adb.exe','adb']);
  if (adb) {
    const r=await run(adb,['devices','-l']);
    for (const line of r.output.split(/\r?\n/).slice(1)) {
      const m=line.trim().match(/^(\S+)\s+(device|unauthorized|offline)(.*)$/);
      if (!m) continue;
      let model='';
      if (m[2]==='device') {
        const q=await run(adb,['-s',m[1],'shell','getprop','ro.product.model']);
        model=q.output;
      }
      const os= m[2]==='device' ? (await run(adb,['-s',m[1],'shell','getprop','ro.build.version.release'])).output : '';
      devices.push({type:'Android',brand:'Altul',model:model||'Android device',os:os?'Android '+os:'',serial:m[1],state:m[2],details:m[3].trim()});
    }
  }
  const ideviceId=findExe(['idevice_id.exe','idevice_id']);
  const ideviceInfo=findExe(['ideviceinfo.exe','ideviceinfo']);
  if (ideviceId) {
    const ids=await run(ideviceId,['-l']);
    for (const serial of ids.output.split(/\r?\n/).filter(Boolean)) {
      let model='iPhone / iPad', os='';
      if (ideviceInfo) {
        const p=await run(ideviceInfo,['-u',serial,'-k','ProductType']);
        const v=await run(ideviceInfo,['-u',serial,'-k','ProductVersion']);
        if(p.output) model=p.output;
        if(v.output) os='iOS/iPadOS '+v.output;
      }
      devices.push({type:'Apple',brand:'Apple',model,os,serial,state:'connected'});
    }
  }
  return {devices,tools:{adb:!!adb,idevice_id:!!ideviceId,ideviceinfo:!!ideviceInfo},note:'Dispozitivele blocate, în Recovery/DFU sau fără drivere pot să nu apară în aceste liste.'};
}
ipcMain.handle('cart3r:detect', async()=>detectDevices());
ipcMain.handle('cart3r:adb', async(_event, command)=>{
  const allowed={
    devices:['devices','-l'],state:['get-state'],
    model:['shell','getprop','ro.product.model'],
    version:['shell','getprop','ro.build.version.release'],
    battery:['shell','dumpsys','battery']
  };
  if(!Object.prototype.hasOwnProperty.call(allowed,command)) return {error:'Comandă nepermisă.'};
  const adb=findExe(['adb.exe','adb']);
  if(!adb) return {error:'ADB nu a fost găsit. Instalează Android SDK Platform-Tools și adaugă folderul platform-tools în PATH.'};
  return run(adb,allowed[command]);
});
ipcMain.handle('cart3r:usbcheck', async()=>{
  const ps='Get-Service -Name "Apple Mobile Device Service" -ErrorAction SilentlyContinue | Select-Object Name,Status | Format-Table -AutoSize; Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue | Where-Object {$_.Class -in @("USB","AndroidUsbDevice") -or $_.FriendlyName -match "Apple|iPhone|iPad|Android|Samsung"} | Select-Object Status,Class,FriendlyName | Format-Table -AutoSize';
  return run('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-Command',ps],20000);
});
function createWindow(){
  const win=new BrowserWindow({width:1280,height:850,minWidth:900,minHeight:650,backgroundColor:'#09070b',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  win.loadFile('index.html');
}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
