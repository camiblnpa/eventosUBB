import { Component, OnInit } from '@angular/core';
import { evento, users } from 'src/app/model/model.index';
import { Router } from '@angular/router';
import { EventoUsersService, UserService } from '../../../servicios/servicio.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comision-crear',
  templateUrl: './comision-crear.component.html',
  styleUrls: ['./comision-crear.component.css']
})
export class ComisionCrearComponent implements OnInit {

  public identity; //obtiene los datos del usuario
  public idUsuario; //almacena id del usuario identificado
  public idEvento; //almacena el id del evento para enviar al servicio
  public comision;
  public integrante; //almacena el nombre completo del integrante de la comisión

  //variables para el select
  public evento: evento;
  public eventos: any = []; //almacena los eventos
  public optionEvento;

  public usuario: users;
  public usuarios: any = []; //almacenar los usuarios
  public options;

  configUsuario = {
    displayKey: 'email', //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Seleccionar usuarios', // text to be displayed when no item is selected defaults to Select,
    moreText: 'más', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: '¡No se encuentra el usuario!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Buscar usuarios', // label thats displayed in search input,
    searchOnKey: 'email' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }

  configEvento = {
    displayKey: 'nombreEvento', //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Seleccionar evento', // text to be displayed when no item is selected defaults to Select,
    noResultsFound: '¡No se encuentra el evento!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Buscar evento', // label thats displayed in search input,
    searchOnKey: 'evento_idEvento' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }

  constructor(private eventoUsersService: EventoUsersService, private userService: UserService,
    private router: Router) {
    this.identity = this.userService.getIdentity();
    this.usuario = new users('', '', '', '', '', null, null, null);
    this.evento = new evento('', '', '', '', '', null, '', null, null, null, null);
  }

  ngOnInit() {
    this.getIdUsuario();
    this.listarEventos();
    this.getUsuarios();
  }

  getIdUsuario() {
    if (!this.identity.id)
      this.idUsuario = this.identity.sub;
    else
      this.idUsuario = this.identity.id;
  }

  getUsuarios() {
    this.userService.getUsuarioComision(this.idUsuario).subscribe(
      response => {
        if (response.code == 200) {
          console.log(response);
          this.options = response.users;
        }
      },
      error => {
        console.log(<any>error);
      })
  }

  listarEventos() {
    this.eventoUsersService.getMisEventosAdmin(this.idUsuario).subscribe(
      response => {
        if (response.code == 200) {
          this.optionEvento = response.eventos;
        }
      },
      error => {
        console.log(<any>error);
      })
  }

  crearComision(form) {
    this.idEvento = this.eventos.idEvento;
    Swal.showLoading();
    this.eventoUsersService.crearComision(this.usuarios, this.idEvento).subscribe(
      response => {
        console.log(response);
        if (response.evento) {
          Swal.fire({
            type: 'success',
            title: 'Se han agregado correctamente los integrantes a la comisión'
          });
          this.router.navigate(['/verComisiones']);
        }
        if (response.evento == null){
          Swal.fire({
            type: 'error',
            title: 'El usuario seleccionado ya pertenece a la comisión'
          });
        }
      },
      error => {
        console.log(<any>error);
      })
  }

  salirCrearComision() {
    Swal.fire({
      title: '¿Está seguro que desea salir?',
      text: "Al salir, no se agregarán los integrantes a la comisión",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#03C303',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero salir',
      cancelButtonText: 'No, no quiero salir'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/verComisiones']);
      }
    })
  }

}
