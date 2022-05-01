import { createAction, props } from '@ngrx/store';
import { Course, Notification, Rush } from '../list-classes/list-classes.component';
import { Weekend } from '../list-classes/weekend-dialog/weekend-dialog.component';

export const setCourses = createAction(
  '[App] Set courses',
  props<{ courses: Course[] }>()
);

export const setCourse = createAction(
  '[App] Set course',
  props<{ course: Course }>()
);

export const addCourse = createAction(
  '[App] Add course',
  props<{ course: Course }>()
);

export const setRush = createAction(
  '[App] Set rush',
  props<{ rush: Rush }>()
);

export const setLoadingRush = createAction(
  '[App] Set loading rush',
  props<{ loadingRush: boolean }>()
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

export const setCoursesFilter = createAction(
  '[App] Set courses filter',
  props<{ coursesFilter: string }>()
);

export const setTodayCourses = createAction(
  '[App] Set today courses',
  props<{ todayCourses: Course[] }>()
);

export const setSettings = createAction(
  '[App] Set settings',
  props<{ settings: Weekend }>()
);

export const setLoadingSetting = createAction(
  '[App] Set loading setting',
  props<{ loadingSetting: boolean }>()
);
