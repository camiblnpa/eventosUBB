import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { global } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {

  public url: string;

  constructor( private http: HttpClient ) { 
    this.url = global.url; 
  }

  getTiposEventos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.url + 'tipoEvento', {headers: headers});
  }
}
