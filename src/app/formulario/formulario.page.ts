import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Datos } from '../datos';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { AlertController } from '@ionic/angular';

@Component({
  
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
    nuevo = false;
    docJug: any = {
      id : null,
      data: {} as Datos
    };
   
  editarJug: Datos;  
  idJugSelec = null;
  constructor(private firestoreService: FirestoreService,private router:Router, private activatedRoute: ActivatedRoute, private alertController: AlertController) {
    // Crear una tarea vacía
    this.editarJug = {} as Datos;
  } 
  
  ngOnInit() {
    
    this.idJugSelec = this.activatedRoute.snapshot.paramMap.get("id");
    if ( this.idJugSelec == 'nuevo'){
      this.nuevo = true;
    }else{
      this.nuevo = false;
    this.firestoreService.consultarId("datos", this.idJugSelec).subscribe((resultado) => {
      
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.docJug.id = resultado.payload.id
        this.docJug.data = resultado.payload.data();
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.docJug.data = {} as Datos;
      } 
    });
  }
  }
  navigateToInicio() {
    this.router.navigate(["/home"]);
  }
  clicBotonModificar() {
    this.firestoreService.actualizar("datos", this.idJugSelec, this.docJug.data).then( () => {
      console.log("Jugador actualizado.")
      // Actualizar la lista completa
      this.obtenerListaJugadores();
      // Limpiar datos de pantalla
      this.docJug.data = {} as Datos;
    })
  }
  clicBotonInsertar() {
    this.firestoreService.insertar("datos", this.docJug.data).then(() => {
      console.log('Jugador añadido.');
      this.docJug.data= {} as Datos;
    }, (error) => {
      console.error(error);
    });
  }
  clicBotonBorrar() {
    this.firestoreService.borrar("datos", this.idJugSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaJugadores();
      // Limpiar datos de pantalla
      this.docJug.data = {} as Datos;
    })
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
      })
    });
  } 
  async alertaBorrar() {
    const alert = await this.alertController.create({
      header: 'AVISO',
      message: '<h3>¿Estás seguro de borrar este jugador?</h3>'+'<h3><b>'+this.docJug.data.Nombre+" "+this.docJug.data.Apellidos+'</b></h3>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Borrar',
          handler: () => {
            this.clicBotonBorrar();
            this.navigateToInicio();
          }
        }
      ]
    });
    await alert.present();
  }
  async alertaModificar() {
    const alert = await this.alertController.create({
      header: 'AVISO',
      message: '<h3>¿Deseas sobreescibir los datos?</h3>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Modificar',
          handler: () => {
            this.clicBotonModificar();
            this.navigateToInicio();
          }
        }
      ]
    });
    await alert.present();
  }
}
