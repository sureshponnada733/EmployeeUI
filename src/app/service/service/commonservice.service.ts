import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employeemodal } from '../../components/employee-list/employeemodal';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  constructor(private http:HttpClient) {  }
 
  baseUrl = 'https://localhost:7102/api/Employees';
  
  getEmployees(){
    return this.http.get<Employeemodal[]>(`${this.baseUrl}`).pipe(res=>res);
  }

  upDateEmployee(id:string, body:Employeemodal){
    return this.http.put(`${this.baseUrl}/${id}`, body).pipe(res=>res);
  }

  deleteEmployee(id:string){
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(res=>res);
  }
}


// {
//   "email": "sri@gmail.com",
//   "name": "Sri",
//   "phone": "230404",
//   "salary": 2344040
// }

// 519bb9e3-d1b3-40a1-23ff-08de266ffbfc

// API https://localhost:7102/api/Employees/519bb9e3-d1b3-40a1-23ff-08de266ffbfc 
