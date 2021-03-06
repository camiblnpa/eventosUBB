import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  public url: string; //acá se guarda el http://localhost:8000/api/ que esta en global.ts

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  //Obtener el reporte Administrador UBB
  getReporteAdminUBB(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.url + 'reporteAdminUBB', { headers: headers });
  }

  //Obtener el reporte Administrador Unidad
  getReporteAdminUnidad(unidad): Observable<any> {
    let json = JSON.stringify(unidad);
    let params = 'json=' + json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //tipo de peticion
    return this.http.post(this.url + 'getReporteAdminUnidad', params, { headers: headers });
  }

}
