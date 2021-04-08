import jwt, { SignOptions, JsonWebTokenError } from 'jsonwebtoken'
import { promisify } from 'util'
import fs from 'fs'
import jwksRsa from 'jwks-rsa'
import { DecodedJwtData } from './types/jwt-helper.type'

const fsReadFileAsync = promisify(fs.readFile)

let jwtSignOptions: SignOptions = {
  algorithm: 'RS256',
}

export const getJwtOptions = () => jwtSignOptions

export const initJwt = (options: SignOptions) => {
  jwtSignOptions = {
    ...jwtSignOptions,
    ...options,
  }

  return getJwtOptions()
}

export const createJWT = async (payload: any, privateKeyPath: string, options: SignOptions = {}): Promise<string> => {
  const cert = await fsReadFileAsync(privateKeyPath)

  const combinedSignOptions: SignOptions = {
    ...jwtSignOptions,
    ...options,
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, cert, combinedSignOptions, (err, token) => {
      if (err) {
        reject(err)
      }

      resolve(token || '')
    })
  })
}

export const tryValidateJWT = async (token: string, publicKeyPath: string) => {
  if (!token) {
    new Error('Token Not provided')
  }

  let cert: Buffer

  try {
    cert = await fsReadFileAsync(publicKeyPath)
  } catch (error) {
    return new JsonWebTokenError(error)
  }

  const strippedToken = token.replace(/"/g, '')

  return new Promise((resolve, reject) => {
    jwt.verify(strippedToken, cert, (err, decoded) => {
      if (err) {
        reject(err)
      }

      resolve(decoded)
    })
  })
}

export const getAuth0SigningKey = async (domain: string): Promise<string> => {
  const jwksClient = jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  })

  let key

  try {
    const keys = await jwksClient.getSigningKeys()

    key = keys[0].getPublicKey()
  } catch (e) {
    throw new Error(e)
  }

  return Promise.resolve(key)
}

export const tryValidateAuth0Jwt = async (token: string, domain: string): Promise<DecodedJwtData> => {
  if (!token) {
    new Error('Token Not provided')
  }

  const signingKey = await getAuth0SigningKey(domain)

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signingKey,
      {
        algorithms: ['RS256'],
      },
      (err: any, decoded: any) => {
        if (err) {
          reject(err)
        }

        let data

        if (decoded.sub) {
          data = { ...data, sub: decoded.sub }
        } else {
          reject('no sub')
        }

        if (decoded.aud) {
          data = { ...data, aud: decoded.aud }
        } else {
          reject('no audience')
        }

        resolve(data)
      },
    )
  })
}
