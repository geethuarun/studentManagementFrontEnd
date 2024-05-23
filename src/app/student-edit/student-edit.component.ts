import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import Swal from 'sweetalert2'

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
  studentId: any;
  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router, private route: ActivatedRoute) {
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
      var studentId = params['pk'];
      this.studentService.getStudent(studentId).subscribe(student => {
        this.editForm.patchValue(student);
      });
    });

    this.editForm.get('email')?.valueChanges.subscribe(value => {
      this.checkEmail(value);
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.editForm.valid && !this.emailTaken) {
      this.studentService.updateStudent(this.editForm.value,this.studentId).subscribe(
        response => {
          Swal.fire('Success', 'Student updated successfully!', 'success');
          this.router.navigate(['']); 
        },
        error => {
          Swal.fire('Error', 'Failed to update student!', 'error');
        }
      );
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

  // onStateChange(event: Event): void {
  // }
  onStateChange(event: Event): void {
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

onSubjectChange(event: any): void {
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


  // onSubjectChange(event: any) {
  //   // Define subject change logic here
  // }

  // constructor(
  //   private fb: FormBuilder,
  //   private studentService: StudentService,
  //   private route: ActivatedRoute,
  //   private router: Router
  // ) {

  // }
  // {
  //   this.editForm = this.fb.group({
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     dob: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     address: this.fb.group({
  //       address: ['', Validators.required],
  //       state: ['', Validators.required],
  //       city: ['', Validators.required],
  //       pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  //     }),
  //     subjects: [[], Validators.required],
  //     previousEducation: this.fb.array([])
  //   });

  //   this.editForm.get('email')?.valueChanges.subscribe(value => {
  //     this.checkEmail(value);
  //   });
  // }

  // ngOnInit() {
  //   this.studentId = this.route.snapshot.params['id'];
  //   this.studentService.getStudent(this.studentId).subscribe(student => {
  //     this.editForm.patchValue(student);
  //     // this.setPreviousEducation(student.previousEducation);
  //     // this.setSelectedSubjects(student.subjects);
  //     // this.onStateChange({ target: { value: student.address.state } });
  //   });
  // }

  // get previousEducation(): FormArray {
  //   return this.editForm.get('previousEducation') as FormArray;
  // }

  // addEducation() {
  //   this.previousEducation.push(this.fb.group({
  //     school: ['', Validators.required],
  //     yearStart: ['', Validators.required],
  //     yearEnd: ['', Validators.required]
  //   }));
  // }

  // removeEducation(index: number) {
  //   this.previousEducation.removeAt(index);
  // }

  // setPreviousEducation(education: any[]) {
  //   education.forEach(edu => {
  //     this.previousEducation.push(this.fb.group({
  //       school: [edu.school, Validators.required],
  //       yearStart: [edu.yearStart, Validators.required],
  //       yearEnd: [edu.yearEnd, Validators.required]
  //     }));
  //   });
  // }

  // setSelectedSubjects(subjects: string[]) {
  //   this.editForm.get('subjects')?.setValue(subjects);
  // }

  // isSubjectSelected(subject: string): boolean {
  //   return this.editForm.get('subjects')?.value.includes(subject);
  // }

  // onStateChange(event: any) {
  //   const selectedState = event.target.value;
  //   if (selectedState === 'State1') {
  //     this.cities = ['City1-1', 'City1-2'];
  //   } else if (selectedState === 'State2') {
  //     this.cities = ['City2-1', 'City2-2'];
  //   } else if (selectedState === 'State3') {
  //     this.cities = ['City3-1', 'City3-2'];
  //   }
  //   this.editForm.get('address.city')?.reset();
  // }

  // onSubjectChange(event: any) {
  //   const subjects = this.editForm.get('subjects')?.value;
  //   if (event.target.checked) {
  //     subjects.push(event.target.value);
  //   } else {
  //     const index = subjects.indexOf(event.target.value);
  //     if (index > -1) {
  //       subjects.splice(index, 1);
  //     }
  //   }
  //   this.editForm.get('subjects')?.setValue(subjects);
  // }

  // checkEmail(email: string) {
  //   this.studentService.checkEmail(email).subscribe(response => {
  //     this.emailTaken = response.isTaken;
  //     if (this.emailTaken) {
  //       this.editForm.get('email')?.setErrors({ emailTaken: true });
  //     }
  //   });
  // }

  // onSubmit() {
  //   if (this.editForm.valid && !this.emailTaken) {
  //     this.studentService.updateStudent(this.studentId, this.editForm.value).subscribe(
  //       response => {
  //         Swal.fire('Success', 'Student details updated successfully!', 'success');
  //         this.router.navigate(['']);
  //       },
  //       error => {
  //         Swal.fire('Error', 'Failed to update student details!', 'error');
  //       }
  //     );
  //   }
  // }

}
