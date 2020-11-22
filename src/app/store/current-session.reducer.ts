import { Action, createReducer, on, createSelector } from '@ngrx/store';
import * as AppActions from './current-session.actions';
import { Course, Notification, Rush } from '../list-classes/list-classes.component';
import { AppState } from '.';
import * as moment from 'moment';

export interface CurrentSessionState {
  courses: Course[];
  selectedCourses: Course[];
  notifications: Notification[];
  rush: Rush;
}

export const initialState: CurrentSessionState = {
  courses: [],
  selectedCourses: [],
  notifications: [],
  rush: null,
};

const currentSessionReducer = createReducer(
  initialState,
  on(AppActions.addCourse, (state, { course }) => ({ ...state, courses: [...state.courses, course] })),
  on(AppActions.setRush, (state, { rush }) => ({ ...state, rush })),
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
export const selectTodayCourses = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => {
    return state.courses.filter(course => {
      const todayCourses = JSON.parse(localStorage.getItem('todayCourses')) || {};
      if (todayCourses[course._id] && todayCourses[course._id].some((date: string) => date === moment().format('YYYY-MM-DD'))) {
        return false;
      }

      const reminders: string[] = [];
      reminders.push(moment(course.date).add(1, 'day').format('YYYY-MM-DD'));
      if (course.difficulties === 'tough') {
        reminders.push(moment(course.date).add(2, 'day').format('YYYY-MM-DD'));
      }
      reminders.push(moment(course.date).add(5, 'day').format('YYYY-MM-DD'));
      reminders.push(moment(course.date).add(15, 'day').format('YYYY-MM-DD'));
      reminders.push(moment(course.date).add(30, 'day').format('YYYY-MM-DD'));

      return reminders.includes(moment().format('YYYY-MM-DD'));
    });
  }
);
export const selectNotifications = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.notifications,
);
export const selectRush = createSelector(
  selectCurrentSession,
  (state: CurrentSessionState) => state.rush,
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
