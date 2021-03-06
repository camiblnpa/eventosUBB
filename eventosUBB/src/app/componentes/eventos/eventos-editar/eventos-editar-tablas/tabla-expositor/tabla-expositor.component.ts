import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ExpositorService, ModalService } from '../../../../../servicios/servicio.index';
import { expositor } from '../../../../../model/model.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-expositor',
  templateUrl: './tabla-expositor.component.html',
  styleUrls: ['../../eventos-editar.component.css']
})
export class TablaExpositorComponent implements OnInit {

  public expositor: expositor;
  public contModal: number;
  public idExpositor: number;
  public idExpositorEdit: number = 0;

  public dataSourceExpositor;
  public displayedColumnsExpositor: string[] = ['nombreExpositor', 'correoExpositor', 'empresa', 'telefonoExpositor', 'sexo', 'editExpositor', 'deleteExpositor'];
  public cantExpositores: number;

  constructor(private expositorService: ExpositorService, private modalService: ModalService,
    public paginatorSettings: MatPaginatorIntl, private route: ActivatedRoute) {
    this.expositorService.getGeneralEmitter().subscribe(e => {
      console.log(e + ' tabla expositor');
      this.mostrarExpositores();
    })
    this.expositorService.getGeneralEmitter().subscribe(edit => {
      console.log(edit + ' tabla expositor');
      this.mostrarExpositores();
    })

  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.mostrarExpositores();
    this.paginadorSettings();
  }

  mostrarExpositores() {
    this.route.params.subscribe(params => {
      let idEvento = params['id'];
      this.expositorService.getExpositoresActividad(idEvento).subscribe(
        response => {
          if (response.code == 200 && (response.expositor.length) > 0) {
            this.cantExpositores = response.expositor.length;
            this.dataSourceExpositor = new MatTableDataSource(response.expositor);
            this.dataSourceExpositor.sort = this.sort;
            this.dataSourceExpositor.paginator = this.paginator;

            this.dataSourceExpositor.filterPredicate = (data: expositor, filterJson: string) => {
              const matchFilter = [];
              const filters = JSON.parse(filterJson);

              filters.forEach(filter => {
                const val = data[filter.id] === null ? '' : data[filter.id];
                matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
              });
              return matchFilter.every(Boolean);
            };
          }
        },
        error => {
          console.log(<any>error);
        })
    })
  }

  agregarExpositorModal() {
    this.contModal = 1;
    this.modalService.mostrarModal();
    this.expositorService.getGeneralEmitter().subscribe(e => {
      console.log(e + ' Estoy en la tabla');
      this.mostrarExpositores();
    })
  }

  changeFromParent(){
    this.idExpositorEdit;
  }

  editarExpositor(id) {
    this.contModal = 2;
    this.idExpositorEdit = id;
    this.modalService.mostrarModal();
    this.expositorService.getGeneralEmitter().subscribe(edit => {
      console.log(edit + ' tabla expositor');
      this.mostrarExpositores();
    })
  }

  eliminarExpositor(idExpositor) {
    Swal.fire({
      title: '¿Quiere eliminar este expositor?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar expositor',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.expositorService.deleteExpositor(idExpositor).subscribe(
          response => {
            if (response) {
              this.mostrarExpositores();
              Swal.fire('Expositor eliminado', '', 'success')
            }
          },
          error => {
            console.log(<any>error);
          })
      }
    })
  }

  doFilterExpositor(filterValue){
    const tableFilters = [];
    tableFilters.push({
      id: 'nombreExpositor',
      value: filterValue
    });

    this.dataSourceExpositor.filter = JSON.stringify(tableFilters);
    if(this.dataSourceExpositor.paginator) {
      this.dataSourceExpositor.paginator.firstPage();
    }
  }

  paginadorSettings() {
    this.paginatorSettings.itemsPerPageLabel = 'Elementos por página';
    this.paginatorSettings.previousPageLabel = 'Página anterior';
    this.paginatorSettings.nextPageLabel = 'Página siguiente';
  }

}
