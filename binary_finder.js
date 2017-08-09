const { exec } = require('child_process');

//  Note: This function is not parsing every single directory for any possible chrome version.
//  Instead, it tests if an installed chrome instance is available through the native BASH-CLI.
exports.findChromeBinary = function() {
    return new Promise(function(fulfill, reject) {
        const options = ['chrome', 'google-chrome', 'chromium'];
        const versionPattern = new RegExp(/Google Chrome\s+\d+\.\d+\.\d+/);

        /*for(var n = 0; n < options.length; n++)
            exec(options[n] + ' --version', (err, stdout, stderr) => {
                if(!err &&  versionPattern.test(stdout)) fulfill([options[n]]);
                else if(++rejectCounter == 3) reject('Didn\'t find chrome on the system');
            });*/

            exec(options[0] + ' --version', (err, stdout, stderr) => {
                if(!err &&  versionPattern.test(stdout)) fulfill([options[0]]);
                else exec(options[1] + ' --version', (err, stdout, stderr) => {
                    if(!err &&  versionPattern.test(stdout)) fulfill([options[1]]);
                    else exec(options[2] + ' --version', (err, stdout, stderr) => {
                        if(!err &&  versionPattern.test(stdout)) fulfill([options[2]]);
                        else reject('Didn\'t find chrome on the system');
                    });
                });
            });
    });
}
