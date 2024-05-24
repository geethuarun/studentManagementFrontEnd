import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import Swal from 'sweetalert2'
import {Student} from '../model/student'

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit{
  editForm: FormGroup;
  states = ['State1', 'State2', 'State3'];
  cities: string[] = [];
  subjects = ['Math', 'Science', 'History'];
  emailTaken = false;
  studentId!: number;
  students: Student | undefined;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.studentId = this.route.snapshot.params['pk'];

    this.editForm = this.fb.group({
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

    this.route.params.subscribe(params => {
      this.studentId = params['pk'];
      this.studentService.getStudent(this.studentId).subscribe(student => {
        // this.students=student
        this.editForm.patchValue(student);
        // this.setSubjects(student.subjects);
        // this.setPreviousEducation(student.previousEducation);
        // this.onStateChange({ target: { value: student.address.state } })
      });
    });

    this.editForm.get('email')?.valueChanges.subscribe(value => {
      this.checkEmail(value);
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.editForm.valid && !this.emailTaken) {

    // if (this.editForm.valid ) {
      this.studentService.updateStudent(this.studentId, this.editForm.value).subscribe(
        response => {
          Swal.fire('Success', 'Student updated successfully!', 'success');
          this.router.navigate(['']); 
        },
        error => {
          Swal.fire('Error', 'Failed to update student!', 'error');
        }
      );
    }
    else{
      this.editForm.markAllAsTouched()
    }
  }

  checkEmail(email: string) {
    this.studentService.checkEmail(email).subscribe(response => {
      this.emailTaken = response.isTaken;
      if (this.emailTaken) {
        this.editForm.get('email')?.setErrors({ emailTaken: true });
      }
    });
  }

  get previousEducation() {
    return this.editForm.get('previousEducation') as FormArray;
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

  onStateChange(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;
    if (selectedState === 'State1') {
      this.cities = ['City1-1', 'City1-2'];
    } else if (selectedState === 'State2') {
      this.cities = ['City2-1', 'City2-2'];
    } else if (selectedState === 'State3') {
      this.cities = ['City3-1', 'City3-2'];
    }
    this.editForm.get('address.city')?.reset();
  }

  onSubjectChange(event: any) {
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

  isSubjectSelected(subject: string): boolean {
    return this.editForm.get('subjects')?.value.includes(subject);
  }

  setSubjects(subjects: string[]) {
    this.editForm.get('subjects')?.setValue(subjects || []);
  }

  setPreviousEducation(education: any[]) {
    const control = this.editForm.get('previousEducation') as FormArray;
    education.forEach(edu => {
      control.push(this.fb.group({
        school: [edu.school, Validators.required],
        yearStart: [edu.yearStart, Validators.required],
        yearEnd: [edu.yearEnd, Validators.required]
      }));
    });
  }
}
 

