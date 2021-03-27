export const assertedVar = (envVar?: string): string => {
  if (!envVar) {
    console.error('env variable does not exist')
    process.exit(1)
  }

  return envVar
}

export const envToArray = (envVar: string) => {
  let result

  try {
    result = envVar.replace(/\s/g, '').split(',')
  } catch (e) {
    console.error('env variable invalid, should be "email@email.com" or "email@email.com, email2@email.com ...." ')
    process.exit(1)
  }

  return result
}

export const unslash = (envVar?: string): string | undefined => {
  if (!envVar) {
    return
  }

  return envVar.replace(/^\/+/, '')
}
