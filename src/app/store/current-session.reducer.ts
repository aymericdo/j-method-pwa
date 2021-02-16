import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as AppActions from './current-session.actions';
import { Course, Notification, Rush } from '../list-classes/list-classes.component';
import { AppState } from '.';
import { Settings } from '../settings/settings.component';

export interface CurrentSessionState {
  courses: Course[];
  selectedCourses: Course[];
  todayCourses: Course[];
  notifications: Notification[];
  rush: Rush;
  loadingRush: boolean;
  loadingSetting: boolean;
  settings: Settings;
}

export const initialState: CurrentSessionState = {
  courses: [],
  selectedCourses: [],
  todayCourses: [],
  notifications: [],
  rush: null,
  loadingRush: false,
  loadingSetting: false,
  settings: {
    maxCoursesNumber: null,
  },
};

const currentSessionReducer = createReducer(
  initialState,
  on(AppActions.addCourse, (state, { course }) => ({ ...state, courses: [...state.courses, course] })),
  on(AppActions.setRush, (state, { rush }) => ({ ...state, rush })),
  on(AppActions.setLoadingRush, (state, { loadingRush }) => ({ ...state, loadingRush })),
  on(AppActions.setCourses, (state, { courses }) => ({ ...state, courses })),
  on(AppActions.setCourse, (state, { course }) => ({ ...state, courses: [...state.courses.filter(c => c._id !== c._id), course] })),
  on(AppActions.setSelectedCourses, (state, { selectedCourses })  => ({ ...state, selectedCourses })),
  on(AppActions.setNotifications, (state, { notifications })  => ({ ...state, notifications })),
  on(AppActions.shiftNotification, (state)  => ({ ...state, notifications: state.notifications.slice(1) })),
  on(AppActions.setSettings, (state, { settings })  => ({ ...state, settings })),
  on(AppActions.setLoadingSetting, (state, { loadingSetting }) => ({ ...state, loadingSetting })),
  on(AppActions.setTodayCourses, (state, { todayCourses })  => ({ ...state, todayCourses })),
);

export function reducer(state: CurrentSessionState | undefined, action: Action) {
  return currentSessionReducer(state, action);
}

export const selectCurrentSession = (state: AppState) => state.currentSession;

export const selectCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses,
);
export const selectTodayCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.todayCourses,
);
export const selectSettings = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.settings,
);
export const selectLoadingSetting = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.loadingSetting,
);
export const selectNotifications = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.notifications,
);
export const selectRush = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.rush,
);
export const selectLoadingRush = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.loadingRush,
);
export const selectSelectedCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.selectedCourses,
  );
  export const selectIsOnPause = createSelector(
    selectCurrentSession,
    (state: CurrentSessionState) => !!state.notifications[0].isOnPauseSince,
    );
export const selectOpenedCourse = (id: string) => createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.find(c => c._id === id),
);
