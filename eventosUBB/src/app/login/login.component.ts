import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/';
import { filter, map } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { users } from '../model/users';
import { UserService } from '../servicios/servicio.index';
import Swal from 'sweetalert2';

declare function init_plugins(); // para cargar los componentes
declare const gapi: any; //constante para la librería gapi que está en index 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  hide = true;
  public titulo: string;
  public user: users;
  public status: string;
  public token;
  public identity;
  public notificacion = 0;

  auth2: any; //declarar objeto con info de google

  constructor(private userService: UserService, private router: Router, private title: Title) {
    this.user = new users('', '', '', '', '', null,null,'', null);

    this.getDataRoute()
      .subscribe(data => {
        this.titulo = data.titulo;
        this.title.setTitle('EventosUBB - ' + this.titulo);
      });

  }

  ngOnInit() {
    init_plugins();
    this.googleInit();
  }

  // Inicialización de la API
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({ //el init recibe el client_id, las cookies y scope
        client_id: '964769714688-k37ooin32et4b2a7iokpbtcv2nn5ca41.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email' //información que se necesita de la cuenta de google 
      });

      this.attachSignin(document.getElementById('btnGoogle'));

    });
  }

  //Iniciar sesión con google
  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (Google_Client) => {
      //Obtener los datos del usuario
      //let profile = Google_Client.getBasicProfile();

      let token = Google_Client.getAuthResponse().id_token;

      this.userService.loginGoogle(token).subscribe(
        response => {
          this.token = response;

          this.identity = response;
          localStorage.setItem('token', token);
          localStorage.setItem('identity', JSON.stringify(this.identity));
          window.location.href = '#/inicio';

          //this.router.navigate(['/inicio']);
        });

    });
  }

  //Iniciar sesión con email y contraseña 
  onSubmit(form: NgForm) {
    Swal.fire({
      title: 'Iniciando sesión'
    })
    Swal.showLoading();  
    
    this.userService.signUp(this.user).subscribe(
      response => {
        console.log(response);
        // Recibir el TOKEN 
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          // Objeto usuario identificado 
          this.userService.signUp(this.user, true).subscribe(
            response => {
              console.log(response);
              this.identity = response;
              if(this.identity.verified == 1){
                localStorage.setItem('token', this.token);
                localStorage.setItem('identity', JSON.stringify(this.identity));
                Swal.close();
                this.router.navigate(['/inicio']);
              } else {
                this.notificacion = 1;
                Swal.fire({
                  title: 'Correo no verificado',
                  type: 'warning'
                })
              }
            },
            error => {
              Swal.fire({
                title: 'Problemas con el servidor',
                type: 'error'
              })
              Swal.close();
              console.log(<any>error);
            }
          );
        } else {
          if( response.password ) {
            Swal.fire({
              title: 'Contraseña incorrecta',
              type: 'error'
            });}
          if( response.correo ){
            Swal.fire({
              title: 'Correo incorrecto',
              type: 'error'
            })}
            if( response.code == 404 ) {
              Swal.fire({
                title: 'Usuario no encontrado',
                type: 'error'
              })
            }
        }
      },
      error => {
        if(error){
          Swal.fire({
            title: 'Problemas con el servidor',
            type: 'error'
          })
        }
        console.log(<any>error);
      }
    );
  }

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data)
    )
  }

}