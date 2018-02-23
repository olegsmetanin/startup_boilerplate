import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { combineEpics } from 'redux-observable';
import { ActionsObservable, Epic } from 'redux-observable'

import { Action } from 'redux'
//import { browserHistory } from 'react-router';
//import { routerMiddleware } from 'react-router-redux';
import { Observable } from 'rxjs'
//import 'rxjs/add/operator/delay';
//import 'rxjs/add/operator/mapTo';

//import rootReducer from './reducers';
//import rootEpic from './epics';
import { combineReducers } from 'redux';


export const CLEARED_SEARCH_RESULTS = "CLEARED_SEARCH_RESULTS"
export const CHECK_ADMIN_ACCESS = "CHECK_ADMIN_ACCESS"
export const ACCESS_DENIED = "ACCESS_DENIED"

export interface ClearResultsAction extends Action {
  type: string
}

export function clearSearchResults(): ClearResultsAction {
  return {
      type: CLEARED_SEARCH_RESULTS
  }
}

const someEpic = (action$: ActionsObservable<ClearResultsAction>) : Observable<ClearResultsAction>  =>
action$.ofType(ACCESS_DENIED)
.delay(100)
//.mapTo(null)
    //.filter(action => true)
    .mapTo(clearSearchResults())

const rootEpic = combineEpics(
  someEpic
)

const epicMiddleware = createEpicMiddleware(rootEpic)

const initialState: any[] = [];
function userResults(state = initialState, action: Action){
    switch(action.type) {
        case CLEARED_SEARCH_RESULTS:
            return initialState;
        default:
            return state
    }
}


const rootReducer = combineReducers({
  userResults,
})


export function configureStore() {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        epicMiddleware,
       // routerMiddleware(browserHistory)
      )
    )
  );
  return store;
}