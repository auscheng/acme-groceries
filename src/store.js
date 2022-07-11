import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import logger from 'redux-logger';
import axios from "axios";

const groceriesReducer = (state = [], action) => {
  switch(action.type) {
    case 'LOAD':
      return action.groceries
    case 'UPDATE':
      return state.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery )
    case 'CREATE':
      return [...state, action.grocery]
    default:
      return state
  }
}

const viewReducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_VIEW':
      return action.view
    default:
      return state
  }
}

const rootReducer = combineReducers({
  groceries: groceriesReducer,
  view: viewReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, thunk)));
export default store
export { updateGroceries, createGrocery };

/////////////////////////
// Newly added actions
/////////////////////////
// These are thunks.
// Regular action creators just return action objects
// thunks return functions that
// 1) accept "dispatch" as an argument
// 2) can perform whatever logic
// 3) and uses that "dispatch" method to dispatch actions

const updateGroceries = (grocery) => {
  return async (dispatch) => {
    const updated = (await axios.put(`/api/groceries/${grocery.id}`, { purchased: !grocery.purchased })).data;
    dispatch({ type: 'UPDATE', grocery: updated});
  }
}

const createGrocery = () => {
  return async (dispatch) => {
    const grocery = (await axios.post('/api/groceries/random')).data;
    dispatch({ type: 'CREATE', grocery });
  }
}

////////////////////////////
//Old
////////////////////////////
// const initialState = {
//   groceries: [],
//   view: ''
// };
// const store = createStore((state = initialState, action)=> {
//   if(action.type === 'LOAD'){
//     state = {...state, groceries: action.groceries };
//   }
//   if(action.type === 'UPDATE'){
//     state = {...state, groceries: state.groceries.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery )};
//   }
//   if(action.type === 'CREATE'){
//     state = {...state, groceries: [...state.groceries, action.grocery ]}
//   }
//   if(action.type === 'SET_VIEW'){
//     state = {...state, view: action.view};
//   }
//   return state;
// });
//
// export default store;


