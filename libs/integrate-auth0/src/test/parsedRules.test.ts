import { parseRules } from '../rules/parseRules'

describe('User role rule', () => {
  it('should return right result for user-roles-rule.txt', async () => {
    const result = await parseRules('user-roles-rule')

    expect(result.name).toEqual('user-roles-rule')
    expect(result.script).toBeDefined()
    expect(result.enabled).toBeTruthy()
  })

  it('should return right result for user-link-acc-rule.txt', async () => {
    const result = await parseRules('user-link-acc-rule')

    expect(result.name).toEqual('user-link-acc-rule')
    expect(result.script).toBeDefined()
    expect(result.enabled).toBeTruthy()
  })
})
