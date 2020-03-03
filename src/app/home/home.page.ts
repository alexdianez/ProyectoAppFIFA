import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Datos } from '../datos';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  arrayColeccionJug: any = [{
    id: null,
    data: {} as Datos
   }];
   
  editarJug: Datos;  
  idJugSelec: string;
  pickupLocation: string;
  constructor(public loadingCtrl: LoadingController,private authService: AuthService,public afAuth: AngularFireAuth,private firestoreService: FirestoreService,private router:Router,private angularFirestore: AngularFirestore,private route:ActivatedRoute) {
    this.route.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.pickupLocation = this.router.getCurrentNavigation().extras.state.pickupLocation;
      }
    });
    // Crear una tarea vacía
    this.editarJug = {} as Datos;
    this.obtenerListaJugadores();
    
  } 
  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      }
    })
  }
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
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
    navigateToFormularioNuevo(nuevo) {   
      this.router.navigate(["/formulario/"+nuevo]);
  }
    navigateToInfo() {
      this.router.navigate(["/info/"]);
    }
    navigateToInicio() {
      this.router.navigate(["/home"]);
    }
    navigateToLogin() {
      this.router.navigate(["/login"]);
    }
    navigateToSearch(){
      console.log("search")
      this.router.navigate(["/search/"]);
    }
  
  // navigateToInicio() {
  //   this.router.navigate(["/home"]);
  // }
  
  // clicBotonBorrar() {
  //   this.firestoreService.borrar("datos", this.idJugSelec).then(() => {
  //     // Actualizar la lista completa
  //     this.obtenerListaJugadores();
  //     // Limpiar datos de pantalla
  //     this.editarJug = {} as Datos;
  //   })
  // }
    // clicBotonInsertar() {
    //   this.firestoreService.insertar("datos", this.editarJug).then(() => {
    //     console.log('Jugador añadido.');
    //     this.editarJug= {} as Datos;
    //   }, (error) => {
    //     console.error(error);
    //   });
    // }
  // clicBotonModificar() {
  //   this.firestoreService.actualizar("datos", this.idJugSelec, this.editarJug).then( () => {
  //     console.log("Jugador actualizado.")
  //     // Actualizar la lista completa
  //     this.obtenerListaJugadores();
  //     // Limpiar datos de pantalla
  //     this.editarJug = {} as Datos;
  //   })
  // }
  
  
}
