import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  clientName: string | null | undefined;

  constructor(
    private _authService: AuthService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.findUserName();
    this._authService.client.subscribe(clientData => {
      if(clientData) {
        const storedClientString = localStorage.getItem('client');
        if (storedClientString) {
          // Convierte la cadena de nuevo a un objeto JavaScript
          const storedClient = JSON.parse(storedClientString);
          this.clientName = storedClient;
        }
      }
    });
  }

  findUserName(){
    const storedClientString = localStorage.getItem('client');
    if (storedClientString) {
      // Convierte la cadena de nuevo a un objeto JavaScript
      const storedClient = JSON.parse(storedClientString);
      this.clientName = storedClient;
    }
  }

  logout(){
    localStorage.removeItem('client');
    this.clientName = undefined;
    this.router.navigate(['/']);;
  }
}
