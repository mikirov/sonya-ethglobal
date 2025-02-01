module.exports = {
    apps: [
      {
        name: 'evita-build', // Build process for evita
        script: 'pnpm',
        args: 'build', // Build the application
        interpreter: 'none', // Run pnpm directly
        autorestart: false, // The build process should not restart automatically
      },
      {
        name: 'evita', // Start process for evita
        script: 'pnpm',
        args: 'start', // Start the application
        interpreter: 'none',
        watch: false, // Set to true if you want pm2 to watch for file changes
      },
    ],
  };