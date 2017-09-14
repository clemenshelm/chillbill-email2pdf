'use strict'

const commands = require('child_process');
//  Note: This function is not parsing every single directory for any possible chrome version.
//  Instead, it tests if an installed chrome instance is available over the native BASH.

function BinaryFinder() {
  this.findChromeBinary = function findChromeBinary() {
    return new Promise((resolve, reject) => {
      const possibleBinaryNames = ['chrome', 'google-chrome', 'chromium', "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"];
      const versionPattern = new RegExp(/Google Chrome\s+\d+\.\d+\.\d+/);
      let command;
      //  Trys every binary-name in the array
      //  and checks the pattern of the [binary-name] --version output
      //  in order to verify the authenticity of the binary
      // replace needed for osx path
      possibleBinaryNames.forEach((binary) => {
        command = commands.spawnSync(binary, ['--version']);
        if (!command.error && versionPattern.test(command.stdout)) {
          resolve([binary.replace(/ /g, '\\ ')]);
        }
      });

      reject('Couldn\'t find chrome on the system');
    });
  };
}

module.exports = BinaryFinder;
