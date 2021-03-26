import { createLogger, transports, format, Logger } from 'winston'
import shortid from 'shortid'

const { combine, timestamp, printf, prettyPrint, colorize } = format

type LoggerHandlerType = 'info' | 'warn' | 'error'
type CustomLoggerOptions = {
  serviceInstanceId?: string
  customPrefixes?: string[]
}

type GetLoggerFuncType = (arg1: string, ...args: string[]) => Logger

export type BuildedLogger = {
  info: GetLoggerFuncType
  warn: GetLoggerFuncType
  error: GetLoggerFuncType
}

const colorizer = colorize({
  colors: {
    debug: 'blue',
  },
})

const devLogFormat = printf((msg) => {
  let level = msg.level

  if (msg.level !== 'error') {
    level = `${msg.level} `
  }

  return colorizer.colorize(msg.level, `${msg.timestamp} [${level}]: ${msg.message}`)
})

const currentFormat = process.env.NODE_ENV !== 'production' ? devLogFormat : prettyPrint()

const loggerObj = createLogger({
  format: combine(timestamp(), currentFormat),
  transports: [new transports.Console()],
})

const getLogHandler = (type: LoggerHandlerType, prefix: string): GetLoggerFuncType => (
  arg1: string,
  ...args: string[]
) => loggerObj[type](`${prefix} - ${arg1}`, ...args)

const BuildLogger = (options?: CustomLoggerOptions): BuildedLogger => {
  let prefix

  if (options) {
    prefix =
      options.customPrefixes && options.customPrefixes.length
        ? `${options.serviceInstanceId} - ${options.customPrefixes.join(' - ')}`
        : options.serviceInstanceId || ''
  } else {
    prefix = shortid.generate()
  }

  return {
    info: getLogHandler('info', prefix),
    warn: getLogHandler('warn', prefix),
    error: getLogHandler('error', prefix),
  }
}

export { BuildLogger }
