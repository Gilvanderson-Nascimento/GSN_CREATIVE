
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  // Cria a janela do navegador.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Carrega a aplicação.
  if (isDev) {
    // Em desenvolvimento, carrega a partir do servidor de desenvolvimento do Next.js.
    win.loadURL('http://localhost:9002');
    // Abre as DevTools.
    win.webContents.openDevTools();
  } else {
    // Em produção, carrega o arquivo index.html da build do Next.js.
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e estiver pronto para criar janelas do navegador.
app.whenReady().then(createWindow);

// Encerra quando todas as janelas forem fechadas.
app.on('window-all-closed', () => {
  // No macOS, é comum que aplicações e suas barras de menu 
  // permaneçam ativas até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // No macOS, é comum recriar uma janela no aplicativo quando o
  // ícone do dock é clicado e não há outras janelas abertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
