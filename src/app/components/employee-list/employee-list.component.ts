import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonserviceService } from '../../service/service/commonservice.service';
import { Employeemodal } from './employeemodal';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, CurrencyPipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  constructor(
    private _commonService: CommonserviceService,
    private _fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  @ViewChild('modalAddUser') modalAddUser!: ElementRef;

  modalInstance: any;
  title = 'employeeUI';
  employeeList: Employeemodal[] = [];
  employeeForm!: FormGroup;
  isUpdate: boolean = false;
  currentEmployeeId:any;
  filterEmployee:Employeemodal[] = []
  searchText: string = "";

  ngOnInit(): void {
    this.employeeForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      salary: ['', Validators.required],
    });

    this._commonService.getEmployees().subscribe((res: Employeemodal[]) => {
      this.employeeList = res;
      this.filterEmployee = res;
    });
  }

onSearch() {
  const text = this.searchText?.toLowerCase() || '';
  this.filterEmployee = this.employeeList.filter(emp =>
    emp.name.toLowerCase().includes(text) ||
    emp.email.toLowerCase().includes(text)
  );
}

  onEdit(employee: Employeemodal) {
    // employee is a single object, not an array
    this.currentEmployeeId = employee.id;
    this.isUpdate = true;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
    });
    // this.employeeForm.reset();
    this.modalAddUser.nativeElement.style.display = 'block';

  }

  updateEmployee(id: string, payload: Employeemodal) {
    const index = this.filterEmployee.findIndex(x=>x.id == id)
      if (index > -1) {
        this.filterEmployee[index] = {
          ...this.filterEmployee[index],
          ...payload,
        };
        this.toastr.success('Employee updated successfully');
      }

    this._commonService.upDateEmployee(id, payload).subscribe((res) => {
      console.log(res);
      // Reset modal
      this.isUpdate = false;
      this.employeeForm.reset();
      this.closeModal();
    });
  }


  deleteEmployee(id:any, employee:string){
      const confirmed = window.confirm(`${employee} will be deleted. Are you sure?`);

  if (!confirmed) {
    this.toastr.info('Delete cancelled');
    return;
  }


    this._commonService.deleteEmployee(id).subscribe((res)=>{
      console.log(res);
      this.filterEmployee = this.filterEmployee.filter((x)=>x.id != id);
      this.toastr.success('Employee deleted successfully');
    })
  }
   
 

onSubmit() {
  if (this.employeeForm.valid) {
    const newEmployee: Employeemodal = this.employeeForm.value;

    this._commonService.addEmployee(newEmployee).subscribe(
      (res: Employeemodal) => {
        // Update local arrays after backend returns success
        this.filterEmployee.push(res);
        this.employeeForm.reset();
        this.closeModal();
        this.toastr.success('Employee Added successfully');
      },
      (err) => {
        this.toastr.error('Failed to add employee');
        console.error(err);
      }
    );
  } else {
    this.toastr.error('Please fill all the fields');
    return this.employeeForm.value;
  }
}


  addEmployee() {
    this.employeeForm.reset();
    this.modalAddUser.nativeElement.style.display = 'block';
    this.isUpdate = false;
  }

  closeModal() {
    this.modalAddUser.nativeElement.style.display = 'none';
  }
}
