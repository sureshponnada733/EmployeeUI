import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

export const routes: Routes = [
    {path:'',redirectTo:'employeelist',pathMatch:'full'},
    {path: 'employeelist',    component: EmployeeListComponent},
    {path: 'employeelist/:id', component: EmployeeListComponent}
];
