/*
 *  Action Types
 */

export const SHOW_LOADING_MODAL = 'SHOW_LOADING_MODAL';
export const SHOW_MODAL = 'SHOW_MODAL';
export const RESET_MODAL = 'RESET_MODAL';
export const UPDATE_USER = 'UPDATE_USER';

/*
 *  Action Creators
 */

export const showLoadingModal = () => {
  return { type: SHOW_LOADING_MODAL };
}

export const showModal = (title, message) => {
  return { 
    type: SHOW_MODAL,
    payload: {
      title: title,
      message: message
    }
  };
}

export const resetModal = () => {
  return { type: RESET_MODAL };
}

export const updateUser = (data) => {
  return { 
    type: UPDATE_USER, 
    payload: {
      ...data 
    }
  };
}