import path from 'path'
import { initJwt, createJWT, tryValidateJWT } from './jwt-helper'

describe('jwt-helper', () => {
  let singletonOptions: any

  beforeAll(() => {
    singletonOptions = initJwt({
      issuer: 'test',
      audience: 'test',
      subject: 'test',
      expiresIn: `1h`,
    })
  })

  it('should create jwt with given certs', async () => {
    const jwt = await createJWT({ test: 1 }, path.join(__dirname, '__test__/certs/jwtRS256.key'))
    expect(jwt).toBeDefined()
  })

  it('should be valid jwt', async () => {
    const jwt = await createJWT({ test: 1 }, path.join(__dirname, '__test__/certs/jwtRS256.key'))
    const valid = await tryValidateJWT(jwt, path.join(__dirname, '__test__/certs/jwtRS256.key.pub'))
    expect(valid).toBeTruthy()
  })
})
