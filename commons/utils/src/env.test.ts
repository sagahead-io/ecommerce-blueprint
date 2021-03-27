import { assertedVar, envToArray, unslash } from './env'

describe('env utils functions', () => {
  it('should successfully assert value from env var', () => {
    const result = assertedVar('some string')
    expect(result).toEqual('some string')
  })

  it('should successfully convert env var to array of strings', () => {
    const result = envToArray('some, string')
    const result2 = envToArray('some,string')

    expect(result).toEqual(['some', 'string'])
    expect(result2).toEqual(['some', 'string'])
  })
  it('should successfully unslash env var', () => {
    const result = unslash('/slashed')
    expect(result).toEqual('slashed')
  })

  it('should not change unslashed env var', () => {
    const result = unslash('unslashed')
    expect(result).toEqual('unslashed')
  })
})
