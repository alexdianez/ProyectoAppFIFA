import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken  } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,FormsModule,ReactiveFormsModule,AngularFireModule.initializeApp(environment.firebase),AngularFireAuthModule, AngularFireStorageModule,
    AngularFirestoreModule],
    providers: [
      StatusBar,
      SplashScreen,
      NativeGeocoder,
      SocialSharing,
      ImagePicker,
      CallNumber,
      { provide: FirestoreSettingsToken, useValue: {} },
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
   
  bootstrap: [AppComponent]
})
export class AppModule {}
