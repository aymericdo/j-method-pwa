import { createAction, props } from '@ngrx/store';
import { Course, Notification } from '../list-classes/list-classes.component';

export const setCourses = createAction(
  '[App] Set courses',
  props<{ courses: Course[] }>()
);

export const addCourse = createAction(
  '[App] Add course',
  props<{ course: Course }>()
);

export const shiftNotification = createAction(
  '[App] Shift notifications',
);

export const setNotifications = createAction(
  '[App] Set notifications',
  props<{ notifications: Notification[] }>()
);

export const setSelectedCourses = createAction(
  '[App] Set selected courses',
  props<{ selectedCourses: Course[] }>()
);
