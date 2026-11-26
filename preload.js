const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSpotifyUpdate: (callback) => {
    ipcRenderer.on('spotify-update', (_event, data) => callback(data));
  },
  sendMediaKey: (action) => {
    ipcRenderer.send('media-key', action);
  },
  setFullscreen: (flag) => {
    ipcRenderer.send('set-fullscreen', flag);
  }
});
