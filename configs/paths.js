const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = {
  appDist: resolveApp('dist'),
  skylinkNodeModules: resolveApp('node_modules/skylinkjs/node_modules'),
  adapterjsRN: resolveApp('adapter.js'),
  skylink_RNIndexJs: resolveApp('index.js'),
  sampleApp: resolveApp('sample-app'),
};

export default paths;
