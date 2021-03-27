import * as auth0 from 'auth0'
import { parseRules, ParsedRule } from './rules/parseRules'
import {
  Auth0InstallClientOptions,
  Auth0InstallAppOptions,
  Auth0InstallClient,
  Auth0InstallAppResponse,
  Auth0InstallRulesAndRolesResponse,
} from './types'

let options: Auth0InstallClientOptions
let installAuth0: Auth0InstallClient

const setupAuth0Roles = async (): Promise<auth0.Role[]> => {
  const userRoles: auth0.Role[] = options.userRoles || [
    { name: 'user', description: 'App user role' },
    { name: 'admin', description: 'Admin user role' },
  ]

  return Promise.all(
    userRoles.map(
      async (role): Promise<auth0.Role> => {
        try {
          const result =
            role.name &&
            (await installAuth0.managementClient.createRole({ name: role.name, description: role.description }))

          return {
            ...role,
            ...result,
          }
        } catch (e) {
          if (e && e.statusCode === 409) {
            try {
              const allRoles = await installAuth0.managementClient.getRoles()
              const rolesMap = allRoles.reduce((p, c) => {
                return { ...p, ...(role.name === c.name && c.id && { [`${role.name}`]: c.id }) }
              }, {})

              const id = rolesMap[`${role.name}`]
              const result = await installAuth0.managementClient.updateRole({ id }, role)
              return {
                ...role,
                ...result,
              }
            } catch (err) {
              throw new Error(`Unable to create or update role, ${err}`)
            }
          } else {
            throw new Error(`Unable to perform roles creation ${e}`)
          }
        }
      },
    ),
  )
}

const setupAuth0Rule = async (rule: ParsedRule, order: number): Promise<auth0.Rule> => {
  try {
    const result = await installAuth0.managementClient.createRule(rule)
    return result
  } catch (e) {
    if (e && e.statusCode === 409) {
      try {
        const allRules = await installAuth0.managementClient.getRules()
        const particularRule = allRules.filter((r) => r.name === rule.name).find((r) => r.name === rule.name)

        if (particularRule && particularRule.id && rule.name === particularRule.name) {
          const updatedResult = await installAuth0.managementClient.updateRule(
            { id: particularRule.id },
            { ...rule, order },
          )

          return updatedResult
        } else {
          throw new Error('Something wrong with rules mapping, please fix code.')
        }
      } catch (err) {
        throw new Error(`Unable to create or update rule, ${err}`)
      }
    } else {
      throw new Error(`Unable to perform rules creation ${e}`)
    }
  }
}

const setupAuth0RulesEnvVariables = async (): Promise<void> => {
  try {
    await installAuth0.managementClient.setRulesConfig({ key: 'CLIENT_ID' }, { value: options.clientId })
    await installAuth0.managementClient.setRulesConfig({ key: 'CLIENT_SECRET' }, { value: options.clientSecret })
  } catch (e) {
    throw new Error(`Unable setup configuration of Auth0 rules ${e}`)
  }
}

const getAuth0ManagementApi = (): Promise<auth0.ManagementClient> => {
  return new Promise((resolve, reject) => {
    const scope = options.scope || undefined
    const audience = options.audience || `https://${options.domain}/api/v2/`

    installAuth0.auth0AuthenticationClient.clientCredentialsGrant(
      {
        scope,
        audience,
      },
      (err, response) => {
        if (err || !response.access_token) {
          reject(err)
        }

        resolve(
          new auth0.ManagementClient({
            domain: options.domain,
            token: response.access_token,
          }),
        )
      },
    )
  })
}

export const getInstallAuth0 = (): Auth0InstallClient => installAuth0

export const setupAuth0Clients = async (installOptions: Auth0InstallClientOptions): Promise<Auth0InstallClient> => {
  try {
    options = {
      ...options,
      ...installOptions,
    }

    const auth0AuthenticationClient = new auth0.AuthenticationClient({
      domain: options.domain,
      clientSecret: options.clientSecret,
      clientId: options.clientId,
    })

    installAuth0 = {
      ...installAuth0,
      auth0AuthenticationClient,
    }

    const managementClient = await getAuth0ManagementApi()

    installAuth0 = {
      ...installAuth0,
      managementClient,
    }

    return installAuth0
  } catch (e) {
    throw new Error(`Failed to save configs ${e}`)
  }
}

export const installAuth0Apps = async (appOptions: Auth0InstallAppOptions): Promise<Auth0InstallAppResponse> => {
  try {
    const adminApp = await installAuth0.managementClient.createClient({
      name: appOptions.admin_app_name || 'Admin App',
      app_type: appOptions.app_type || 'spa',
    })

    const webApp = await installAuth0.managementClient.createClient({
      name: appOptions.web_app_name || 'Web App',
      app_type: appOptions.app_type || 'spa',
    })

    const adminAppConn = await installAuth0.managementClient.createConnection({
      name: 'Admin-Password-Authentication',
      strategy: 'auth0',
    })

    const webAppConns = await installAuth0.managementClient.getConnections()
    let webAppConn = webAppConns.find((connection) => connection.name === 'Username-Password-Authentication')

    if (!webAppConn) {
      webAppConn = await installAuth0.managementClient.createConnection({
        name: 'Username-Password-Authentication',
        strategy: 'auth0',
      })
    }

    if (!adminAppConn.id || !webAppConn.id || !adminApp.client_id || !webApp.client_id) {
      throw new Error('Unable to create client or connection')
    }

    await installAuth0.managementClient.updateConnection(
      { id: adminAppConn.id },
      { enabled_clients: [adminApp.client_id], options: { disable_signup: true } },
    )

    await installAuth0.managementClient.updateConnection({ id: webAppConn.id }, { enabled_clients: [webApp.client_id] })

    return {
      webAppConnId: webAppConn.id,
      adminAppConnId: adminAppConn.id,
      webAppClientId: webApp.client_id,
      adminAppClientId: adminApp.client_id,
    }
  } catch (e) {
    throw new Error(`Failed to setup auth0 app ${e}`)
  }
}

export const installAuth0Roles = async (adminEmails: string[]): Promise<Auth0InstallRulesAndRolesResponse> => {
  try {
    const roles = await setupAuth0Roles()

    const userRoleRule = await parseRules('user-roles-rule', adminEmails)
    const createdUserRoleRule = await setupAuth0Rule(userRoleRule, 1)

    const linkUserAccRule = await parseRules('user-link-acc-rule')
    const createdLinkUserAccRule = await setupAuth0Rule(linkUserAccRule, 2)

    await setupAuth0RulesEnvVariables()

    return {
      roles,
      rules: [createdUserRoleRule, createdLinkUserAccRule],
    }
  } catch (e) {
    throw new Error(`Failed in setup auth0 roles ${e}`)
  }
}
