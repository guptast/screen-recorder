const { app, BrowserWindow ,desktopCapturer} = require('electron');
const path = require('path');
const fs = require('fs');
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load your Angular app from http://localhost:4200
  win.loadURL('http://localhost:4200');

  // Open the DevTools (remove this line for production)
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
  setInterval(()=>{
    captureDesktop()
  },5000)
  
}

function captureDesktop() {
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 800, height: 600 } })
      .then(sources => {
        if (sources.length > 0) {
          const source = sources[0];
          const screenshotPath =path.join(__dirname, 'screenshorts/'+new Date().getTime()+'screenshot.png');
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
            if (error) {
            } else {
              win.webContents.send('screenshot', screenshotPath);
            }
          });
        }
      })
      .catch(error => {
      throw(error)
      });
  }

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
