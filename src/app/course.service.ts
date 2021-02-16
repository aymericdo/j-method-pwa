import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Course, Rush } from './list-classes/list-classes.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: `root`
})
export class CourseService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.server}/api/courses`);
  }

  patchCourses(course: Course): Observable<Course> {
    return this.httpClient.patch<Course>(`${this.server}/api/courses/${course._id}`, course);
  }

  addCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(`${this.server}/api/courses`, course);
  }

  deleteCourse(course: Course): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/courses/${course._id}`);
  }

  getTodayClasses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.server}/api/today-classes`);
  }

  postTodayClasses(course: { course: Course }): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.server}/api/today-classes`, course);
  }
}
