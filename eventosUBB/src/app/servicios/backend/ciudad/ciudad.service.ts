import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { global } from '../../global';
import { ciudad } from '../../../model/ciudad';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  public url: string;

  constructor( private http: HttpClient ) { 
    this.url = global.url; 
  }

  getCiudades():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.url + 'ciudad', {headers: headers});
  }

}
