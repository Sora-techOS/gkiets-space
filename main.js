const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow = null;
let tray = null;
let isQuitting = false;
let spotifyTimer = null;

const stateFile = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try {
    if (fs.existsSync(stateFile)) {
      return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    }
  } catch (e) {}
  return { width: 1360, height: 840 };
}

function saveWindowState() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try {
    const bounds = mainWindow.getBounds();
    fs.writeFileSync(stateFile, JSON.stringify(bounds));
  } catch (e) {}
}

function getAppIcon() {
  const icoPath = path.join(__dirname, 'icon.ico');
  if (fs.existsSync(icoPath)) {
    return nativeImage.createFromPath(icoPath);
  }
  const pngPath = path.join(__dirname, 'icon.png');
  if (fs.existsSync(pngPath)) {
    return nativeImage.createFromPath(pngPath);
  }
  return nativeImage.createEmpty();
}

function createWindow() {
  const state = loadWindowState();
  mainWindow = new BrowserWindow({
    title: "gkiet's space",
    width: state.width || 1360,
    height: state.height || 840,
    x: state.x,
    y: state.y,
    minWidth: 800,
    minHeight: 560,
    autoHideMenuBar: true,
    backgroundColor: '#0a0c12',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      saveWindowState();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const icon = getAppIcon().resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip("gkiet's space");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mở lại',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Thoát hẳn',
      click: () => {
        isQuitting = true;
        saveWindowState();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

const SMTC_PS_SCRIPT = `
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage.Streams, ContentType=WindowsRuntime]

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1'
})[0]

function Await($WinRtTask, $ResultType) {
  $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
  $netTask = $asTask.Invoke($null, @($WinRtTask))
  $netTask.Wait(-1) | Out-Null
  $netTask.Result
}

try {
  $mgr = Await ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
  $sp = $mgr.GetSessions() | Where-Object { $_.SourceAppUserModelId -match 'Spotify' } | Select-Object -First 1
  if (-not $sp) {
    Write-Output '{"found":false,"playing":false}'
    exit 0
  }
  $pb = $sp.GetPlaybackInfo()
  $status = $pb.PlaybackStatus.ToString()
  $props = Await ($sp.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
  $thumb = ""
  if ($props.Thumbnail -and ($status -eq 'Playing')) {
    try {
      $ras = Await ($props.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
      $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($ras)
      $ms = New-Object System.IO.MemoryStream
      $netStream.CopyTo($ms)
      $bytes = $ms.ToArray()
      if ($bytes.Length -gt 0) {
        $thumb = "data:image/png;base64," + [Convert]::ToBase64String($bytes)
      }
      $ms.Dispose()
      $netStream.Dispose()
    } catch {}
  }
  @{
    found = $true
    playing = ($status -eq 'Playing')
    title = [string]$props.Title
    artist = [string]$props.Artist
    thumbnail = $thumb
  } | ConvertTo-Json -Compress
} catch {
  Write-Output '{"found":false,"playing":false}'
}
`;

const SMTC_ENCODED = Buffer.from(SMTC_PS_SCRIPT, 'utf16le').toString('base64');

function pollSpotify() {
  exec(
    `powershell -NoProfile -NonInteractive -EncodedCommand ${SMTC_ENCODED}`,
    { encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024 },
    (err, stdout) => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      if (err || !stdout) {
        mainWindow.webContents.send('spotify-update', {
          playing: false,
          track: 'Spotify đang tạm dừng',
          artist: '',
          thumbnail: '',
        });
        return;
      }
      try {
        const line = stdout.trim().split(/\r?\n/).pop();
        const data = JSON.parse(line);
        if (!data.found || !data.playing || !data.title) {
          mainWindow.webContents.send('spotify-update', {
            playing: false,
            track: 'Spotify đang tạm dừng',
            artist: '',
            thumbnail: '',
          });
          return;
        }
        mainWindow.webContents.send('spotify-update', {
          playing: true,
          track: data.title,
          artist: data.artist || 'Spotify',
          thumbnail: data.thumbnail || '',
        });
      } catch (e) {
        mainWindow.webContents.send('spotify-update', {
          playing: false,
          track: 'Spotify đang tạm dừng',
          artist: '',
          thumbnail: '',
        });
      }
    }
  );
}

function sendWindowsMediaKey(vkCode) {
  const psScript = `
$code = @"
using System;
using System.Runtime.InteropServices;
public class MediaKey {
  [DllImport("user32.dll")]
  public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
}
"@
Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
[MediaKey]::keybd_event(${vkCode}, 0, 0, [UIntPtr]::Zero)
[MediaKey]::keybd_event(${vkCode}, 0, 2, [UIntPtr]::Zero)
`;
  const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
  exec(
    `powershell -NoProfile -NonInteractive -EncodedCommand ${encoded}`,
    { windowsHide: true },
    () => {
      setTimeout(pollSpotify, 350);
    }
  );
}

ipcMain.on('media-key', (_event, action) => {
  const vkMap = {
    prev: 0xB1,
    playpause: 0xB3,
    next: 0xB0,
  };
  const code = vkMap[action];
  if (code) sendWindowsMediaKey(code);
});

ipcMain.on('set-fullscreen', (_event, flag) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setFullScreen(Boolean(flag));
  }
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });

  app.setAppUserModelId("gkiet's space");
  app.whenReady().then(() => {
    if (app.isPackaged) {
      app.setLoginItemSettings({ openAtLogin: true });
    }
    createWindow();
    createTray();
    pollSpotify();
    spotifyTimer = setInterval(pollSpotify, 2000);
  });
}

app.on('before-quit', () => {
  isQuitting = true;
  if (spotifyTimer) clearInterval(spotifyTimer);
  saveWindowState();
});
