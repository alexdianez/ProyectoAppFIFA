import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Datos } from '../datos';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  docJug: any = [{
    id : null,
    data: {} as Datos
  }];
 
editarJug: Datos;  
idJugSelec = null;
constructor(private firestoreService: FirestoreService,private router:Router, private activatedRoute: ActivatedRoute, private alertController: AlertController) {
  // Crear una tarea vacía
  this.editarJug = {} as Datos;
  this.obtenerListaJugadores();
}  
obtenerListaJugadores(){
  this.firestoreService.consultar("datos").subscribe((resultadoConsultaJug) => {
    this.docJug = [];
    console.log('Mostrando lista.');
    resultadoConsultaJug.forEach((datosJugador: any) => {
      
      this.docJug.push({
        id: datosJugador.payload.doc.id,
        data: datosJugador.payload.doc.data()
      });
      console.log("Mostrando...")
    })
  });
}
navigateToFormulario(jugadorSelec) {   
    console.log("Jugador seleccionado: ");
    console.log(jugadorSelec);
    this.idJugSelec = jugadorSelec.id;
    this.router.navigate(["/formulario/"+this.idJugSelec]);
    this.editarJug.Nombre = jugadorSelec.data.Nombre;
    this.editarJug.Apellidos = jugadorSelec.data.Apellidos;
    this.editarJug.Media = jugadorSelec.data.Media;
    this.editarJug.Posicion = jugadorSelec.data.Posicion;
    this.editarJug.Altura = jugadorSelec.data.Altura;
    this.editarJug.FNac = jugadorSelec.data.FNac;    
}
navigateToFormularioNew() {
  this.router.navigate(["/useradd/"]);
}
navigateToInfo() {
  console.log("si")
  this.router.navigate(["/info/"]);
}
navigateToInicio() {
  this.router.navigate(["/home"]);
}
}
