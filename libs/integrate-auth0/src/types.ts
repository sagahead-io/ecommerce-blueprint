import * as auth0 from 'auth0'

export type Auth0InstallClient = {
  auth0AuthenticationClient: auth0.AuthenticationClient
  managementClient: auth0.ManagementClient
}

export type Auth0InstallAppOptions = {
  admin_app_name?: string
  web_app_name?: string
  app_type?: 'spa' | 'native' | 'non_interactive' | 'regular_web'
  callbacks: string[] // e.g. ['http://localhost:3000', 'http://localhost:3000/login']
  allowed_logout_urls: string[] // e.g. ['http://localhost:3000', 'http://localhost:3000/logout']
  web_origins: string[] // e.g. ['http://localhost:3000']
  allowed_origins: string[] // e.g. ['http://localhost:3000']
  [propName: string]: any
}

export type Auth0InstallClientOptions = {
  clientId: string
  clientSecret: string
  domain: string
  userRoles?: auth0.Role[]
  audience?: string
  scope?: string
}

export type Auth0InstallAppResponse = {
  webAppConnId: string
  adminAppConnId: string
  webAppClientId: string
  adminAppClientId: string
}

export type Auth0InstallRulesAndRolesResponse = {
  rules: auth0.Rule[]
  roles: auth0.Role[]
}
