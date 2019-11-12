import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Datos } from '../datos';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  arrayColeccionJug: any = [{
    id: "",
    data: {} as Datos
   }];
   
  editarJug: Datos;  
  idJugSelec: string;

  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacía
    this.editarJug = {} as Datos;
    this.obtenerListaJugadores();
  } 
  selecJug(jugadorSelec) {
    console.log("Jugador seleccionado: ");
    console.log(jugadorSelec);
    this.idJugSelec = jugadorSelec.id;
    this.editarJug.Nombre = jugadorSelec.data.Nombre;
    this.editarJug.Apellidos = jugadorSelec.data.Apellidos;
    this.editarJug.Media = jugadorSelec.data.Media;
    this.editarJug.Posicion = jugadorSelec.data.Posicion;
    this.editarJug.Altura = jugadorSelec.data.Altura;
    this.editarJug.FNac = jugadorSelec.data.FNac;
  }
  clicBotonBorrar() {
    this.firestoreService.borrar("datos", this.idJugSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaJugadores();
      // Limpiar datos de pantalla
      this.editarJug = {} as Datos;
    })
  }
  clicBotonInsertar() {
    this.firestoreService.insertar("datos", this.editarJug).then(() => {
      console.log('Jugador añadido.');
      this.editarJug= {} as Datos;
    }, (error) => {
      console.error(error);
    });
  }
  obtenerListaJugadores(){
    this.firestoreService.consultar("datos").subscribe((resultadoConsultaJug) => {
      this.arrayColeccionJug = [];
      console.log('Mostrando lista.');
      resultadoConsultaJug.forEach((datosJugador: any) => {
        this.arrayColeccionJug.push({
          id: datosJugador.payload.doc.id,
          data: datosJugador.payload.doc.data()
        });
      })
    });
  }
  clicBotonModificar() {
    this.firestoreService.actualizar("datos", this.idJugSelec, this.editarJug).then( () => {
      console.log("Jugador actualizado.")
      // Actualizar la lista completa
      this.obtenerListaJugadores();
      // Limpiar datos de pantalla
      this.editarJug = {} as Datos;
    })
  }
}
