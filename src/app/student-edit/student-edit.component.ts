import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Student} from '../model/student'
import Swal from 'sweetalert2';



@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  editForm: FormGroup;
  studentId!: number;
  emailTaken!:false

  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router, private route: ActivatedRoute) {
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      }),
      subjects: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.studentId = +params['pk']; 
      this.populateFormWithStudentDetails(this.studentId);
    });
  }

  populateFormWithStudentDetails(studentId: number) {
    this.studentService.getStudent(studentId).subscribe(
      (student:any) => {
        this.editForm.patchValue({
          first_name: student.first_name,
          last_name: student.last_name,
          date_of_birth: student.date_of_birth,
          email: student.email
        });
        this.editForm.get('address')?.patchValue({
          street: student.street,
          state: student.state,
          city: student.city,
          pincode: student.pincode
        });
        this.editForm.get('subjects')?.setValue(student.subjects);
      }
    );
  }
  onSubjectChange(event:any) {
    const subjects = this.editForm.get('subjects')?.value;
    if (event.target.checked) {
      subjects.push(event.target.value);
    } else {
      const index = subjects.indexOf(event.target.value);
      if (index > -1) {
        subjects.splice(index, 1);
      }
    }
    this.editForm.get('subjects')?.setValue(subjects);
  }

  // checkEmail(email: string) {
  //   this.studentService.checkEmail(email).subscribe(response => {
  //     this.emailTaken = response.isTaken;
  //     if (this.emailTaken) {
  //       this.editForm.get('email')?.setErrors({ emailTaken: true });
  //     }
  //   });
  // }

  
    
  

  onSubmit() {
    if (this.editForm.valid) {
      let updatedStudentDetails = {
        street:this.editForm.value.address.street,
        city:this.editForm.value.address.city,
         pincode: this.editForm.value.address.pincode,
         state:this.editForm.value.address.state,
         date_of_birth:this.editForm.value.date_of_birth ,
         email: this.editForm.value.email,
         first_name: this.editForm.value.first_name,
         last_name: this.editForm.value.last_name,
         subjects:this.editForm.value.subjects}


      
      this.studentService.updateStudent(this.studentId, updatedStudentDetails).subscribe(
        response => {
          console.log('Student details updated successfully:', response);
          this.router.navigate(['']);
        },
        error => {
          console.error('Failed to update student details:', error);
        }
      );
    } else {
      this.editForm.markAllAsTouched();
    }
  }}

