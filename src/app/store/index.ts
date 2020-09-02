import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCurrentSession from './current-session.reducer';

export interface AppState {
  currentSession: fromCurrentSession.CurrentSessionState;
}

export const reducers: ActionReducerMap<AppState> = {
  currentSession: fromCurrentSession.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
