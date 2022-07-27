const color = require('pino');

const consoleColor = color({
    transport: {
        target: 'pino-pretty',
        options: {
          level: 'error',
          colorize: true,
          customColors: 'error:red,info:blue,warn:yellow',
          useOnlyCustomProps: true,
          ignore: 'pid,hostname,time',
          //timestampKey: 'time',
          //translateTime: 'dddd, mmmm dS, yyyy, h:MM:ss TT',
        },
      },
})
// Code By: WearTIme
// Constributor: Reyhan OP

module.exports = consoleColor;