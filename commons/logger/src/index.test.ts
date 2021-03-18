import { BuildLogger } from './'
import shortid from 'shortid'

describe('logger instance', () => {
  it('should successfully create instance', () => {
    const logger = BuildLogger()

    expect(logger).toBeDefined()
  })

  it('should successfully call logger methods ', () => {
    const logger = BuildLogger({
      customPrefixes: ['test'],
      serviceInstanceId: shortid.generate(),
    })

    logger.info = jest.fn()
    logger.warn = jest.fn()
    logger.error = jest.fn()

    const loggerInfoSpy = jest.spyOn(logger, 'info')
    const loggerWarnSpy = jest.spyOn(logger, 'warn')
    const loggerErrorSpy = jest.spyOn(logger, 'error')

    logger.info('info')
    logger.warn('warn')
    logger.error('error')

    expect(loggerInfoSpy).toHaveBeenCalledWith('info')
    expect(loggerWarnSpy).toHaveBeenCalledWith('warn')
    expect(loggerErrorSpy).toHaveBeenCalledWith('error')
  })

  it('should successfully call logger methods without custom prefixes option', () => {
    const logger = BuildLogger({
      serviceInstanceId: shortid.generate(),
    })

    logger.info = jest.fn()

    const loggerInfoSpy = jest.spyOn(logger, 'info')

    logger.info('info')

    expect(loggerInfoSpy).toHaveBeenCalledWith('info')
  })

  it('should successfully call logger methods without instance id option', () => {
    const logger = BuildLogger({
      customPrefixes: ['test'],
    })

    logger.info = jest.fn()

    const loggerInfoSpy = jest.spyOn(logger, 'info')

    logger.info('info')

    expect(loggerInfoSpy).toHaveBeenCalledWith('info')
  })
})
