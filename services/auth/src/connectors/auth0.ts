import { setupAuth0Clients, Auth0InstallClient } from '@commons/integrate-auth0'
import env from '../utils/env'

export const initAuth0 = async (): Promise<Auth0InstallClient> => {
  try {
    return await setupAuth0Clients({
      clientId: env.AUTH0_CLIENT,
      clientSecret: env.AUTH0_SECRET,
      domain: env.AUTH0_DOMAIN,
    })
  } catch (e) {
    throw new Error(`Unable to init auth0 clients ${e}`)
  }
}
