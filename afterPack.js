const path = require('path');
const { rcedit } = require('rcedit');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const exePath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.exe`);
  const icoPath = path.join(__dirname, 'icon.ico');
  await rcedit(exePath, {
    icon: icoPath,
    'version-string': {
      ProductName: "gkiet's space",
      FileDescription: "gkiet's space",
      CompanyName: 'Gia Kiet',
    },
  });
};
