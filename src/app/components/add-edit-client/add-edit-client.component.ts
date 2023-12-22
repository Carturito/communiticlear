import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { ToastrService } from 'ngx-toastr';
import { validateRutElevenModule } from '../../helpers/utils'

@Component({
    selector: 'app-add-edit-client',
    standalone: true,
    templateUrl: './add-edit-client.component.html',
    styleUrl: './add-edit-client.component.css',
    imports: [RouterLink, ReactiveFormsModule, CommonModule, ProgressBarComponent]
})
export class AddEditClientComponent {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operation: string = 'Agregar ';
  clients: Client[] = [];

  profiles = [
    { key: 'Nivel 1: Adminstrador', value: 1 },
    { key: 'Nivel 2: Usuario', value: 2 },
    { key: 'Nivel 3: Cliente', value: 3 },
  ]

  constructor(private fb: FormBuilder, 
    private _clienteService: ClientService, 
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      rut: ['',Validators.required],
      first_name: ['',Validators.required],
      paternal_lastname: ['',Validators.required],
      maternal_lastname: ['',Validators.required],
      password: '',
      level: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      mobile_number: ['',Validators.required],
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.operation = 'Editar ';
      this.getClient(this.id)
    }
    this.getListClient();
  }

  getListClient(){
      this._clienteService.getListClient().subscribe((data) => {
          this.clients = data;
      })
  }

  getClient(id: number) {
    this.loading = true;
    this._clienteService.getClient(id).subscribe((data:Client) => {
      console.log(data),
      this.loading = false;
      this.form.setValue({
        rut: data.rut,
        first_name: data.first_name,
        paternal_lastname: data.paternal_lastname,
        maternal_lastname: data.maternal_lastname,
        password: data.password,
        level: data.level,
        email: data.email,
        mobile_number: data.mobile_number,
      })
    })
  }

  generatePassword() {
    const firstCharOfFirstName = this.form.get('first_name')?.value?.charAt(0) || '';
    const firstCharOfPaternalLastname = this.form.get('paternal_lastname')?.value?.charAt(0) || '';
    const firstCharOfMaternalLastname = this.form.get('maternal_lastname')?.value?.charAt(0) || '';
    let rut = this.form.get('rut')?.value || '';

    // Eliminar puntos y guiones del RUT
    rut = rut.replace(/[\.-]/g, '');

    // Comprobar si el último carácter es una 'K'
    const lastChar = rut.slice(-1).toUpperCase();
    if (lastChar === 'K') {
        // Conservar el último carácter si es una 'K'
        rut = rut.slice(0, -1) + 'k';
    } else {
        // Si el último carácter no es una 'K', asegurarse de que sea un número
        rut = rut.replace(/[^0-9]+$/, '');
    }

    return firstCharOfFirstName + firstCharOfPaternalLastname + firstCharOfMaternalLastname + rut;
  }


  findClient(email: string){
    return this.clients.find((user) => user.email === email);
  }
  
  addClient() {
    console.log('MI FORMULARIO', this.form);
    const rut = this.form.value.rut;
    const email = this.form.value.email;
    const rutCtr = this.form.get('rut');
    
    const clientExist = this.findClient(email);
    if(clientExist && (this.id === 0 || clientExist.id !== this.id)) {
      this.toastr.info(`Ya existe un usuario con el correo ${email}`, 'Usuario Existente');
      return;
    }

    if (rut) {
      if (!validateRutElevenModule(rut)){
        rutCtr?.setErrors({ pattern: true });
        return;
      }
    }
    const password = this.generatePassword();
    const client: Client = {
      rut: this.form.value.rut,
      first_name: this.form.value.first_name,
      paternal_lastname: this.form.value.paternal_lastname,
      maternal_lastname: this.form.value.maternal_lastname,
      password: password,
      level: this.form.value.level,
      email: this.form.value.email,
      mobile_number: this.form.value.mobile_number
    }

    this.loading = true;

    if (this.id !== 0) {
      client.id = this.id;
      this._clienteService.updateClient(this.id, client).subscribe(() => { 
        this.loading = false;
        this.toastr.info(`El cliente ${client.first_name} fue editado con éxito`, 'Cliente editado');
        this.loading = false;
        this.router.navigate(['/list']);
      })
      
    } else {
      this._clienteService.saveClient(client).subscribe(() => {
        this.toastr.success(`El cliente ${client.first_name} fue registrado con éxito`, 'Cliente registrado');
        this.loading = false;
        this.router.navigate(['/list']);
      })
    }

    
    
  }

}
