import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import Swal from 'sweetalert2';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {
  registrationForm: FormGroup;
  states = ['State1', 'State2', 'State3'];
  cities: string[] = [];
  subjects = ['Math', 'Science', 'History'];
  selectedSubjects = [];
  emailTaken = false;

  constructor(private fb: FormBuilder, private studentService: StudentService,private router:Router) {
    
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        address: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      }),
      subjects: [[], Validators.required],
      previousEducation: this.fb.array([])
    });

    // this.registrationForm.get('email')?.valueChanges.subscribe(value => {
      // this.checkEmail(value);
    // });
  }

  ngOnInit() {
  }

  get previousEducation(): FormArray {
    return this.registrationForm.get('previousEducation') as FormArray;
  }

  addEducation() {
    this.previousEducation.push(this.fb.group({
      school: ['', Validators.required],
      yearStart: ['', Validators.required],
      yearEnd: ['', Validators.required]
    }));
  }

  removeEducation(index: number) {
    this.previousEducation.removeAt(index);
  }

  
  dateValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      return { dateInvalid: true };
    }
    return null;
  }
  onStateChange(event: Event): void {
    const selectedState = (event.target as HTMLSelectElement).value;
    if (selectedState === 'State1') {
      this.cities = ['City1-1', 'City1-2'];
    } else if (selectedState === 'State2') {
      this.cities = ['City2-1', 'City2-2'];
    } else if (selectedState === 'State3') {
      this.cities = ['City3-1', 'City3-2'];
    }
    this.registrationForm.get('address.city')?.reset();
  }

  onSubjectChange(event:any) {
    const subjects = this.registrationForm.get('subjects')?.value;
    if (event.target.checked) {
      subjects.push(event.target.value);
    } else {
      const index = subjects.indexOf(event.target.value);
      if (index > -1) {
        subjects.splice(index, 1);
      }
    }
    this.registrationForm.get('subjects')?.setValue(subjects);
  }

  // checkEmail(email: string) {
  //   this.studentService.checkEmail(email).subscribe(response => {
  //     this.emailTaken = response.isTaken;
  //     if (this.emailTaken) {
  //       this.registrationForm.get('email')?.setErrors({ emailTaken: true });
  //     }
  //   });
  // }

  
  onSubmit() {
    // if (this.registrationForm.valid && !this.emailTaken) {
      if (this.registrationForm.valid && !this.emailTaken) {

      this.studentService.registerStudent(this.registrationForm.value).subscribe(
        response => {
          Swal.fire('Success', 'Student registered successfully!', 'success');
          this.router.navigate(['']); 
          this.registrationForm.reset();
          this.selectedSubjects = [];
          while (this.previousEducation.length) {
            this.previousEducation.removeAt(0);
          }
        },
        error => {
          Swal.fire('Error', 'Failed to register student!', 'error');
        }
      );}

  }}
