import { setupAuth0Clients, installAuth0Apps, getInstallAuth0, installAuth0Roles } from '..'
import { Auth0InstallAppResponse, Auth0InstallRulesAndRolesResponse } from '../types'

const { DOMAIN, CLIENT_ID, CLIENT_SECRET, EMAIL } = process.env

let installAuth0AppResult: Auth0InstallAppResponse
let installAuth0RulesResult: Auth0InstallRulesAndRolesResponse

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * ms))
}

const cleanupAuth0 = async () => {
  const installAuth = getInstallAuth0()

  await installAuth.managementClient.deleteClient({ client_id: installAuth0AppResult.adminAppClientId })
  await sleep(2000)
  await installAuth.managementClient.deleteClient({ client_id: installAuth0AppResult.webAppClientId })
  await sleep(2000)
  await installAuth.managementClient.deleteConnection({ id: installAuth0AppResult.adminAppConnId })
  await sleep(2000)
  //await installAuth.managementClient.deleteConnection({ id: installAuth0AppResult.webAppConnId }) usually this connection available by default
  installAuth0RulesResult.rules.map(async (rule) => {
    await installAuth.managementClient.deleteRule({ id: rule.id || '' })
  })
  await sleep(2000)
  installAuth0RulesResult.roles.map(async (role) => {
    await installAuth.managementClient.deleteRole({ id: role.id || '' })
  })
}

describe('Integration test', () => {
  afterAll(() => {
    return cleanupAuth0()
  })
  it('setup required clients', async () => {
    const result = await setupAuth0Clients({
      domain: DOMAIN || '',
      clientId: CLIENT_ID || '',
      clientSecret: CLIENT_SECRET || '',
    })
    expect(result.auth0AuthenticationClient).toBeDefined()
    expect(result.managementClient).toBeDefined()
  })

  it('installs an app', async () => {
    installAuth0AppResult = await installAuth0Apps({
      callbacks: ['http://localhost:3000', 'http://localhost:3000/login'],
      allowed_logout_urls: ['http://localhost:3000', 'http://localhost:3000/logout'],
      web_origins: ['http://localhost:3000'],
      allowed_origins: ['http://localhost:3000'],
    })

    expect(installAuth0AppResult.webAppConnId).toBeDefined()
    expect(installAuth0AppResult.adminAppConnId).toBeDefined()
    expect(installAuth0AppResult.webAppClientId).toBeDefined()
    expect(installAuth0AppResult.adminAppClientId).toBeDefined()
  })

  it('installs roles and rules', async () => {
    installAuth0RulesResult = await installAuth0Roles([EMAIL || ''])

    expect(installAuth0RulesResult.roles).toBeDefined()
    expect(installAuth0RulesResult.rules).toBeDefined()
  })
})
