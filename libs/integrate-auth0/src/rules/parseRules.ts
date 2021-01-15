import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

export interface ParsedRule {
  name: string
  script: string
  enabled: boolean
}

export const parseRules = async (name: string, adminEmails?: string[]): Promise<ParsedRule> => {
  const contents = await readFileAsync(path.join(__dirname, `files/${name}.txt`))
  const script = adminEmails
    ? contents.toString().replace(/<replace with admins email list>/gim, JSON.stringify(adminEmails))
    : contents.toString()

  return {
    name,
    script,
    enabled: true,
  }
}
