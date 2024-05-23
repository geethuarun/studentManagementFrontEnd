import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StudentService } from '../services/student.service';
import {Student} from '../model/student'

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  studentId: any;
  student: any
  


  // constructor(
  //   private route: ActivatedRoute,
  //   private studentService: StudentService,
  //   private router: Router
  // ) {
  //   const studentId = this.route.snapshot.params['id'];
  //   this.studentService.getStudent(studentId).subscribe((student) => {
  //     this.student = student;
  //   });
  // }

  constructor(private studentService: StudentService, private route: ActivatedRoute) { 
    this.studentId = this.route.snapshot.params['pk'];
    console.log(this.studentId);
    

  }


  ngOnInit() {
    //  this.studentId = this.route.snapshot.params['id'];
    // console.log();
    
    this.studentService.getStudent(this.studentId).subscribe(student => {
      this.student = student;
    });
  }
// }


// ngOnInit() {
//   this.route.params.subscribe(params => {
//     const studentId = params['id'];
//     console.log(studentId);
    
//     this.studentService.getStudent(studentId).subscribe((students) => {
//       this.student = students;
//     });
//   });
// }
}
