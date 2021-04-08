import { Store } from 'use-global-hook'
import { GlobalState } from './'

// Associated actions are what's expected to be returned from globalHook
export type StateActions = {
  setIsAuthorized: (value: boolean, cb?: () => void) => void
}

// setIsAuthorized will be returned by globalHook as setValue.bind(null, store)
// This is one reason we have to declare a separate associated actions type
const setIsAuthorized = (store: Store<GlobalState, StateActions>, isAuthorized: boolean, cb?: () => void) => {
  store.setState({ ...store.state, isAuthorized }, () => cb && cb())
}

export const actions = {
  setIsAuthorized,
}
