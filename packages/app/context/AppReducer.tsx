import { Actions, State } from '../interfaces/context'

const AppReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'UPDATE_SHOW':
      return { ...state, show: action.showPayload }
    case 'UPDATE_COLOR':
      return { ...state, color: action.payload }
    case 'FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export default AppReducer
