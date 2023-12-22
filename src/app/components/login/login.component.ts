import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces/client.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, ProgressBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form!: FormGroup;
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private _clienteService: ClientService,
    private _authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['',[ Validators.required, Validators.email] ],
      password: ['',Validators.required],
    });
    this.getClients();
  }

  getClients() {
    this._clienteService.getListClient().subscribe((data:Client[]) => {
      this.clients = data;
    })
  }

  findClient(email: string) {
    return this.clients.find((user) => user.email === email);
  }
  
  validatePassword(client:Client, password: string) {
    if(client.password === password) {
      this._authService.setClientData(client);

      return this.router.navigate(['/list']);;
    }
    return this.toastr.error(`la contraseña no coincide`, 'Contraseña incorrecta');
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    const client = this.findClient(email);
    if (!client) {
      // Usuario no encontrado
      this.toastr.error(`No existe usuario con el correo ${email}`, 'Usuario no encontrado');
      return;
    }

    if (client.level !== 1) {
      // Usuario encontrado pero no tiene permisos
      this.toastr.info(`El usuario no tiene permisos para entrar al sistema`, 'Usuario no autorizado');
      return;
    }

    // Validar contraseña si el usuario existe y tiene permisos
    this.validatePassword(client, password);
  }

}
