import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Course } from './list-classes/list-classes.component';
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

  addCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(`${this.server}/api/courses`, course);
  }

  deleteCourse(course: Course): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/courses/${course._id}`);
  }
}