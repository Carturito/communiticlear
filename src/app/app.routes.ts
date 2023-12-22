import { Routes } from '@angular/router';
import { ListClientsComponent } from './components/list-clients/list-clients.component';
import { AddEditClientComponent } from './components/add-edit-client/add-edit-client.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'list', component: ListClientsComponent},
    {path: 'add', component: AddEditClientComponent},
    {path: 'edit/:id', component: AddEditClientComponent},
    {path: '**', redirectTo:'login', pathMatch: 'full'},
    
];
