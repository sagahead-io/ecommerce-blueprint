import {
  setupAuth0Clients,
  installAuth0Apps,
  // getInstallAuth0,
  installAuth0Roles,
  uninstallAuth0Apps,
  uninstallAuth0Roles,
  getAuth0ManagementApi,
} from '../client'
import { Auth0InstallAppResponse, Auth0InstallRulesAndRolesResponse } from '../types'

const { DOMAIN, CLIENT_ID, CLIENT_SECRET, EMAIL } = process.env

let installAuth0AppResult: Auth0InstallAppResponse
let installAuth0RulesResult: Auth0InstallRulesAndRolesResponse

describe('Integration test', () => {
  const appsConf = {
    callbacks: ['http://localhost:3000', 'http://localhost:3000/login'],
    allowed_logout_urls: ['http://localhost:3000', 'http://localhost:3000/logout'],
    web_origins: ['http://localhost:3000'],
    allowed_origins: ['http://localhost:3000'],
    admin_app_name: 'integration-test-admin-app',
    web_app_name: 'integration-test-web-app',
    oidc_conformant: true,
    jwt_configuration: {
      alg: 'RS256',
    },
  }
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
    installAuth0AppResult = await installAuth0Apps(appsConf)
    const mgmt = await getAuth0ManagementApi()
    const app = await mgmt.getClient({ client_id: installAuth0AppResult.webAppClientId })

    expect(app.callbacks).toEqual(appsConf.callbacks)
    expect(app.allowed_logout_urls).toEqual(appsConf.allowed_logout_urls)
    expect(app.web_origins).toEqual(appsConf.web_origins)
    expect(app.allowed_origins).toEqual(appsConf.allowed_origins)
    expect(app.oidc_conformant).toBeTruthy()
    expect(app.jwt_configuration?.alg).toEqual(appsConf.jwt_configuration.alg)
  })

  it('installs roles and rules', async () => {
    installAuth0RulesResult = await installAuth0Roles([EMAIL || ''])

    expect(installAuth0RulesResult.roles).toBeDefined()
    expect(installAuth0RulesResult.rules).toBeDefined()
  })

  it('uninstalls apps', async () => {
    const uninstalled = await uninstallAuth0Apps(appsConf)
    expect(uninstalled).toBeTruthy()
  })

  it('uninstalls roles and rules', async () => {
    const uninstalled = await uninstallAuth0Roles()
    expect(uninstalled).toBeTruthy()
  })
})
