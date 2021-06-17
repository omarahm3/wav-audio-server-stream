(async () => {
  process.on('uncaughtException', (err) => {
    console.error('run::: Unknown error ::', err);
    console.error('run:: exiting with code (1) ....');
    process.exit(1);
  });

  const config = require('./config.json');

  console.log('run::: Running server with configuration', config);

  // Start our server
  require('./src/server');
})();
