export const ROUTES = {
  dashboard: '/dashboard',
  profile: '/profile',
  profileDetails: '/profile/:profileId',
  login: '/login',
  notFound: '*',
}

export const profileDetailsPath = (profileId: number) => ROUTES.profileDetails.replace(':accountId', `${profileId}`)
