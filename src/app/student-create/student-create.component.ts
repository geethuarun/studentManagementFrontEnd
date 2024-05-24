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
  states :any;
  cities: any;
  subjects:any = [];
  selectedSubjects = [];
  emailTaken = false;

  constructor(private fb: FormBuilder, private studentService: StudentService,private router:Router) {
    
    this.registrationForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
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
    this.cities=[]
    this.loadStates()
    this.getSubject()

    this.registrationForm.get('email')?.valueChanges.subscribe(value => {
      this.checkEmail(value);
    });
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
  
  loadStates() {
      this.studentService.getStates().subscribe(data => {
        this.states = data;
      });
    }
  
  onStateChange(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      let stateId =Number(selectElement.value) ;
   
      this.studentService.getCities(stateId).subscribe(data => {
        this.cities = data;
      });
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

  checkEmail(email: string) {
    this.studentService.checkEmail(email).subscribe(response => {
      this.emailTaken = response.isTaken;
      if (this.emailTaken) {
        this.registrationForm.get('email')?.setErrors({ emailTaken: true });
      }
    });
  }

  
  onSubmit() {
    // if (this.registrationForm.valid && !this.emailTaken) {
      if (this.registrationForm.valid ) {
    
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
      else{
        this.registrationForm.markAllAsTouched()

      }

  }

  getSubject(){
    this.studentService.getSubject().subscribe(data => {
      this.subjects= data})

  }

}
