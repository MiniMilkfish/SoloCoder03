module.exports = {
  port: 3000,
  logs: {
    dir: './logs',
    maxSize: '10m',
    maxFiles: '14d'
  },
  shutdown: {
    timeout: 30000,
    forceTimeout: 35000
  }
};