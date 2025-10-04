const { exec } = require('child_process');
const chokidar = require('chokidar');

// Watch the controllers directory
chokidar
  .watch('app/javascript/controllers/**/*.js')
  .on('all', (event, path) => {
    console.log(
      `${event} detected in ${path}. Running stimulus:manifest:update`
    );
    exec('bin/rails stimulus:manifest:update', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  });
