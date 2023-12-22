import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private myAppUrl  = 'http://localhost:3000/';
  private myApiUrl: string;


  constructor(private http: HttpClient) {
    this.myApiUrl = 'api/clients/'
   }

   getListClient(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.myAppUrl}${this.myApiUrl}`)
   }

   deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`)
   }

   saveClient(client: Client): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, client)
   }

   getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.myAppUrl}${this.myApiUrl}${id}`)
   }

   updateClient(id: number, client: Client): Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, client)
   }
}
