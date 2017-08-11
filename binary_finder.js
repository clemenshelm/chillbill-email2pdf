const { spawnSync } = require('child_process');

//  Note: This function is not parsing every single directory for any possible chrome version.
//  Instead, it tests if an installed chrome instance is available through the native BASH-CLI.
exports.findChromeBinary = function() {
   return new Promise(function (resolve, reject) {
       const options = ['chrome', 'google-chrome', 'chromium'];
       const versionPattern = new RegExp(/Google Chrome\s+\d+\.\d+\.\d+/);
       var child;
       //  Trys every option in the options-array
       //  and checks the pattern of the 'option' --version output
       //  in order to verify the authenticity of the program
       options.forEach(function(value, index, array) {
           child = spawnSync(value, ['--version']);
           if(!child.error && versionPattern.test(child.stdout))
               resolve([value]);
       });
       reject('Couldn\'t find chrome on the system');
   });
}
