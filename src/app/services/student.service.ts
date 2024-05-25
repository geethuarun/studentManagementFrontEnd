import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Student } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {


  constructor(private http: HttpClient) {}

  registerStudent(student: any) {
     return this.http.post('http://127.0.0.1:8000/students/', student)
    // return this.http.post('https://taskcrud-5b1d0-default-rtdb.firebaseio.com/student.json', student);
    // return this.http.post('', student);

  }
  checkEmail(email: string): Observable<{ isTaken: boolean }> {
    return this.http.get<any>('http://127.0.0.1:8000/students/').pipe(
      map(students => {
        const emailTaken = Object.values(students).some((student: any) => student.email === email);
        return { isTaken: emailTaken };
      })
    );
  }

  // checkEmail(email: string){
  //   // return this.http.get<any>(`${this.apiUrl}/check-email/${email}`);
  //   return this.http.get<any>('https://taskcrud-5b1d0-default-rtdb.firebaseio.com/student.json/check-email/'+email+'');

  // }

  getStudents() {
    return this.http.get <{ [key: string]: any }>('http://127.0.0.1:8000/students/').pipe(map(data=>{
      let products = []
      for (let key in data){
        if (data.hasOwnProperty(key)){
          products.push({...data[key]})

        }
        
      }
      return products
    }));
  }

  // getStudents() {
  //   return this.http.get('https://taskcrud-5b1d0-default-rtdb.firebaseio.com/student.json');
  // }

  getStudent(id: number) {
    return this.http.get(`http://127.0.0.1:8000/students/${id}/`);
  }

  updateStudent(id: number, student: any) {
    return this.http.put(`http://127.0.0.1:8000/students/${id}/`, student);
  }

  deleteStudent(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/students/${id}/`);
    // return this.http.delete('https://taskcrud-5b1d0-default-rtdb.firebaseio.com/student/'+id+'.json');

  }

  
  getStates()  {
    return this.http.get('http://127.0.0.1:8000/states/')
  }

  getCities(id:number){
    return this.http.get(`http://127.0.0.1:8000/cities/?state=${id}`)
  }

  getSubject(){
    return this.http.get('http://127.0.0.1:8000/subjects/')
  }
  
  }
  
  
