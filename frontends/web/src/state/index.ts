import React from 'react'
import globalHook from 'use-global-hook'
import { StateActions, actions } from './actions'

// Defining your own state and associated actions is required
export type GlobalState = {
  isAuthorized: boolean
}

const initialState: GlobalState = {
  isAuthorized: false,
}

export const useGlobal = globalHook<GlobalState, StateActions>(React, initialState, actions)
