import React from 'react'

export type GlobalContextType = {
  state: State
  dispatch: React.Dispatch<Actions>
}

export type State = {
  show: 'ALL' | 'AVAILABLE' | 'OWNED'
  filter: string
  color: string
}

export type Actions = {
  type: 'UPDATE_SHOW' | 'FILTER' | 'UPDATE_COLOR'
  payload?: any
  showPayload: State['show']
}
