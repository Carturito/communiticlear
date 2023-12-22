import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientSource = new BehaviorSubject<any>(null);
  client = this.clientSource.asObservable();

  constructor() { }

  setClientData(clientData: any) {
    const { first_name, paternal_lastname } = clientData;
    const userName = first_name +' '+ paternal_lastname;
    const clientName = JSON.stringify(userName);
    
    localStorage.setItem('client', clientName);
    
    this.clientSource.next(clientData);
  }
}
