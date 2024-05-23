import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import {Student} from '../model/student'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {
  studentsNew: Student[]=[]
  searchTerm: string = ''

  constructor(private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {
    this.getStudent();
  }

  getStudent(){
    this.studentService.getStudents().subscribe((students:Student[]) => {
      this.studentsNew = students;
    });
  // search():void{
  //   if (this.searchTerm.trim() !== '') {
  //     this.studentService.checkEmail(this.searchTerm).subscribe((students:Student[]) => this.studentsNew = students);
  //   } else {
  //     this.getStudent();
  //   }
  // }
    
   
  
    // this.studentService.getStudents().subscribe(students => {
    //   this.students = students;
    // });
  }

  
  // deleteStudent(id: number): void {
  //   if (confirm('Are you sure you want to delete this student?')) {
  //     this.studentService.deleteStudent(id).subscribe(() => {
  //       this.getStudent();
  //     });
  //   }
  // }
  deleteStudent(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          );
          this.getStudent();
        }, error => {
          // If there's an error, show an error message
          Swal.fire(
            'Error!',
            'An error occurred while deleting the task.',
            'error'
          );
        });
      }
    });
  }
  

}

