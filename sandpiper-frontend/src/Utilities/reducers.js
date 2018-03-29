import { combineReducers } from 'redux';
import { 
  SHOW_LOADING_MODAL,
  SHOW_MODAL,
  RESET_MODAL,
  UPDATE_USER,
} from './actions';

const initialState = {
  user: {
    id: '',
    token: ''
  },
  modal: {
    isVisible: false,
    title: 'title',
    showMessage: true,
    message: 'message',
    showButtons: true
  }
}

// Handles data for the user object
function user(state = initialState.user, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
          id: action.payload.id, 
          token: action.payload.token
        }
        
    default:
      return state;
  }
}

// Handles data for displaying the Modal and it's properties
function modal(state = initialState.modal, action) {
  switch (action.type) {
    case SHOW_LOADING_MODAL:
      return { 
        ...state, 
        isVisible: true,
        title: 'Loading...',
        showMessage: false,
        showButtons: false
      };
    case SHOW_MODAL: 
      return {
        ...state,
        isVisible: true,
        title: action.payload.title,
        message: action.payload.message
      };
    case RESET_MODAL:
      return { ...initialState.modal };
    default:
      return state;
  }
}

const sandpiperApp = combineReducers({
  user,
  modal
});

export default sandpiperApp;