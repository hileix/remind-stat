const electronInstaller = require('electron-winstaller')
resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './remind-stat-win32-x64',
  outputDirectory: './build',
  authors: 'leix3041',
  exe: 'remind-stat.exe'
})

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`))