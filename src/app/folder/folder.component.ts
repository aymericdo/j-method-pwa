import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store, select } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { CourseService } from "src/app/course.service";
import { NewFolderDialogComponent } from "src/app/folder/new-folder-dialog/new-folder-dialog.component";
import { Course } from "src/app/list-classes/list-classes.component";
import { AppState } from "src/app/store";
import { setCourse, setCourses, setNewTempFolder } from "src/app/store/current-session.actions";
import { selectCoursesWithoutFolder, selectCourses, selectFolders, selectCoursesByFolder, selectNewTempFolder } from "src/app/store/current-session.reducer";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  list$: Observable<Course[]>;
  coursesWithoutFolder$: Observable<Course[]>;
  coursesByFolder$: Observable<{ [folder: string]: Course[] }>;
  folders$: Observable<string[]>;
  newTempFolder$: Observable<string>;
  fetching = true;
  newTempFolderCourses: Course[] = [];
  selectedCourses: Course[] = [];

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.list$ = this.store.pipe(select(selectCourses));
    this.coursesWithoutFolder$ = this.store.pipe(select(selectCoursesWithoutFolder));
    this.coursesByFolder$ = this.store.pipe(select(selectCoursesByFolder));
    this.folders$ = this.store.pipe(select(selectFolders));
    this.newTempFolder$ = this.store.pipe(select(selectNewTempFolder));

    this.fetchEverything()
  }

  selectItem(course: Course): void {
    if (this.selectedCourses.length && ((this.selectedCourses[0].folder || '') !== (course.folder || ''))) return;

    if (this.selectedCourses.some((c) => c._id === course._id)) {
      this.selectedCourses = this.selectedCourses.filter((c) => c._id !== course._id)
    } else {
      this.selectedCourses.push(course);
    }
  }

  setVisibility(hidden: boolean, folder: string): void {
    let courses = [];

    if (folder.length) {
      this.coursesByFolder$.pipe(take(1)).subscribe((coursesByFolder) => {
        courses = coursesByFolder[folder];
      });
    } else {
      this.coursesWithoutFolder$.pipe(take(1)).subscribe((c) => {
        courses = [...c];
      });
    }

    courses.forEach((course) => {
      this.setCourseFolder({ ...course, hidden })
    })
  }

  isSelected(course: Course): boolean {
    return this.selectedCourses.some((c) => c._id === course._id);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    if (!this.selectedCourses.length) {
      this.setCourseFolder({
        ...event.item.data,
        folder: event.container.element.nativeElement.getAttribute('data-folder'),
      })
    } else {
      this.selectedCourses.forEach((course) => {
        this.setCourseFolder({
          ...course,
          folder: event.container.element.nativeElement.getAttribute('data-folder'),
        })
      });
    }
  }

  openNewFolderDialog(): void {
    let folders = [];
    this.folders$.pipe(take(1)).subscribe((f) => folders = f);

    const dialogRef = this.dialog.open(NewFolderDialogComponent, {
      data: { folders },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.store.dispatch(setNewTempFolder({ newFolder: result }));
    });
  }

  courseById(index, course) {
    return course._id;
  }

  folderByName(index, folder) {
    return folder.name;
  }

  trackFolder(index, folder) {
    return folder;
  }

  private fetchEverything(): void {
    this.fetching = true;

    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.fetching = false;
      this.store.dispatch(setCourses({ courses }));
    });
  }

  private setCourseFolder(course: Course): void {
    this.fetching = true;

    this.courseService.patchCourses(course).subscribe((course: Course) => {
      this.fetching = false;
      this.newTempFolderCourses = [];
      this.selectedCourses = [];
      this.store.dispatch(setCourse({ course }));
      this.store.dispatch(setNewTempFolder({ newFolder: '' }));
    });
  }
}
