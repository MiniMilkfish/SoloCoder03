const fs = require('fs');
const path = require('path');
const config = require('../../config');

const logDir = config.logs.dir;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logDir, `tasks-${new Date().toISOString().split('T')[0]}.log`);
  }

  format(level, taskId, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      taskId,
      message,
      data
    };
    return JSON.stringify(logEntry) + '\n';
  }

  async write(level, taskId, message, data = null) {
    const logLine = this.format(level, taskId, message, data);
    console.log(logLine.trim());
    
    try {
      fs.appendFileSync(this.logFile, logLine, 'utf8');
    } catch (err) {
      console.error('Failed to write log:', err.message);
    }
  }

  info(taskId, message, data) {
    return this.write('info', taskId, message, data);
  }

  warn(taskId, message, data) {
    return this.write('warn', taskId, message, data);
  }

  error(taskId, message, data) {
    return this.write('error', taskId, message, data);
  }

  debug(taskId, message, data) {
    return this.write('debug', taskId, message, data);
  }
}

module.exports = new Logger();