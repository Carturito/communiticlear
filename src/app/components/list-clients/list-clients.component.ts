import { Component, OnInit } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBarComponent],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css'
})
export class ListClientsComponent implements OnInit {
  listClients: Client[] = []
  loading: boolean = false

  constructor(private _clienteService: ClientService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getListClient()
  }

  getListClient(){
    this.loading = true;
    setTimeout(() => {
      this._clienteService.getListClient().subscribe((data) => {
          this.listClients = (data);
          this.loading = false;
      })
    }, 1000);
  }

  deleteClient(id: number){
    this.loading = true;
    this._clienteService.deleteClient(id).subscribe(() => {
      this.getListClient();
      this.toastr.warning('El cliente fue eliminado con éxito', 'Cliente eliminado');
    })
  }

}
