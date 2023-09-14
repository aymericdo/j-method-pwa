import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as AppActions from './current-session.actions';
import { Course, Notification, Rush } from '../list-classes/list-classes.component';
import { AppState } from '.';
import { Weekend } from '../list-classes/weekend-dialog/weekend-dialog.component';

export interface CurrentSessionState {
  courses: Course[];
  selectedCourses: Course[];
  coursesFilter: string;
  todayCourses: Course[];
  notifications: Notification[];
  rush: Rush;
  loadingRush: boolean;
  loadingSetting: boolean;
  settings: Weekend;
  newTempFolder: string;
}

export const initialState: CurrentSessionState = {
  courses: [],
  selectedCourses: [],
  coursesFilter: '',
  newTempFolder: '',
  todayCourses: [],
  notifications: [],
  rush: null,
  loadingRush: false,
  loadingSetting: false,
  settings: {
    endDate: null,
    maxCoursesNumber: null,
  },
};

const currentSessionReducer = createReducer(
  initialState,
  on(AppActions.addCourse, (state, { course }) => ({ ...state, courses: [...state.courses, course] })),
  on(AppActions.setRush, (state, { rush }) => ({ ...state, rush })),
  on(AppActions.setLoadingRush, (state, { loadingRush }) => ({ ...state, loadingRush })),
  on(AppActions.setNewTempFolder, (state, { newFolder }) => ({ ...state, newTempFolder: newFolder })),
  on(AppActions.setCourses, (state, { courses }) => ({ ...state, courses })),
  on(AppActions.setCourse, (state, { course }) => ({ ...state, courses: [...state.courses.filter(c => c._id !== course._id), course] })),
  on(AppActions.setCoursesFilter, (state, { coursesFilter }) => ({ ...state, coursesFilter })),
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

export const selectCoursesWithoutFolder = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.reduce((prev, course) => {
    if (!course.folder?.length) {
      prev.push(course);
    }
    return prev;
  }, []),
);
export const selectCoursesByFolder = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.reduce((prev, course) => {
    if (!!course.folder?.length) {
      if (prev.hasOwnProperty(course.folder)) {
        prev[course.folder].push(course);
      } else {
        prev[course.folder] = [course];
      }
    }
    return prev;
  }, {}),
);
export const selectFolders = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.reduce((prev, course) => {
    if (!!course.folder?.length) {
      if (!prev.includes(course.folder)) {
        prev.push(course.folder);
      }
    }
    return prev;
  }, []).sort(),
);
export const selectNewTempFolder = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.newTempFolder,
);
export const selectCoursesWithVisibleFolder = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.filter((course) => !course.hidden),
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
export const selectCoursesFilter = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.coursesFilter,
);
export const selectSelectedCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.selectedCourses,
  );
  export const selectIsOnPause = createSelector(
    selectCurrentSession,
    (state: CurrentSessionState) => !!state.notifications[0]?.isOnPauseSince,
    );
export const selectOpenedCourse = (id: string) => createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.courses.find(c => c._id === id),
);
