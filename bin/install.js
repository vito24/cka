const which = require("which");
const childProcess = require("child_process");

function findNpm() {
  const npms =
    process.platform === "win32"
      ? ["tnpm.cmd", "cnpm.cmd", "npm.cmd"]
      : ["tnpm", "cnpm", "npm"];
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log(`use npm: ${npms[i]}`);
      return npms[i];
    } catch (e) {
      // console.log('error', e)
    }
  }
  throw new Error('please install npm');
}

function runCmd(cmd, args, fn) {
  args = args || [];
  const runner = childProcess.spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on("close", function(code) {
    if (fn) {
      fn(code);
    }
  });
}

module.exports = function(done) {
  const npm = findNpm();
  runCmd(which.sync(npm), ['install'], function () {
    console.log(npm + ' install end');
    done();
  });
};
