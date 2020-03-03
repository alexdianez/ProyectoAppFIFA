import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Datos } from '../datos';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';


import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
    isLogged: boolean;
    nuevo = false;
    private  apiUrl :string = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=10";
    docJug: any = {
      id : null,
      data: {} as Datos,
    };
   
  editarJug: Datos;  
  idJugSelec = null;
  index = null;
  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    public afAuth: AngularFireAuth,
    private socialSharing: SocialSharing,
    private firestoreService: FirestoreService,
    private router:Router, 
    private activatedRoute: ActivatedRoute, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker) {
    // Crear una tarea vacía
    this.editarJug = {} as Datos;
  } 
  compilemsg():string{
    var msg = this.docJug.data.URL;
    return msg;
  }
  regularShare(){
    var msg = this.compilemsg();
    this.socialSharing.share(msg, null, null, null);
  }

  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.isLogged = true;
      }
    })
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
  async uploadImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Por favor espere...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'La subida ha sido completada.',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              //  aunque realmente sólo será 1 como se ha indicado en las opciones
              for (var i = 0; i < results.length; i++) {      
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                //  evitar duplicidades de nombres        
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        // En la variable downloadURL se tiene la dirección de descarga de la imagen
                        console.log("downloadURL:" + downloadURL);
                        this.docJug.data.Imagen=downloadURL;
                        // Mostrar el mensaje de finalización de la subida
                        toast.present();
                        // Ocultar mensaje de espera
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  } 
  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'La imagen fue borrada.',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }
}
