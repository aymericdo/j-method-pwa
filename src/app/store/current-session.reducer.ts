import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as AppActions from './current-session.actions';
import { Course, Notification } from '../list-classes/list-classes.component';
import { AppState } from '.';

export interface CurrentSessionState {
  courses: Course[];
  selectedCourses: Course[];
  notifications: Notification[];
}

export const initialState: CurrentSessionState = {
  courses: [],
  selectedCourses: [],
  notifications: [],
};

const currentSessionReducer = createReducer(
  initialState,
  on(AppActions.addCourse, (state, { course }) => ({ ...state, courses: [...state.courses, course] })),
  on(AppActions.setCourses, (state, { courses }) => ({ ...state, courses })),
  on(AppActions.setSelectedCourses, (state, { selectedCourses })  => ({ ...state, selectedCourses })),
  on(AppActions.setNotifications, (state, { notifications })  => ({ ...state, notifications })),
  on(AppActions.shiftNotification, (state)  => ({ ...state, notifications: state.notifications.slice(1) })),
);

export function reducer(state: CurrentSessionState | undefined, action: Action) {
  return currentSessionReducer(state, action);
}

export const selectCurrentSession = (state: AppState) => state.currentSession;

export const selectCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses,
);
export const selectNotifications = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.notifications,
);
export const selectSelectedCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.selectedCourses,
);
