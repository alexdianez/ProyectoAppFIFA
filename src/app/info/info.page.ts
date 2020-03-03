import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { CallNumber } from '@ionic-native/call-number/ngx';
import {Map,tileLayer,marker} from 'leaflet';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  map:Map;
  newMarker:any;
  address:string[];
  phone = "652022813";
  constructor(private firestoreService: FirestoreService,private router:Router, private activatedRoute: ActivatedRoute,private callNumber: CallNumber) {
    
  } 
   // The below function is added
   ionViewDidEnter(){
    this.loadMap();
  }
 // The below function is added
  loadMap(){
    this.map = new Map("mapId").setView([36.8513868835154,-5.5944967006], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> Web de la empresa <a href="https://www.futhead.com/">FUTHEAD</Web></a>'}).addTo(this.map); // This line is added to add the Tile Layer to our map
  }
  locatePosition() {
    this.newMarker = marker([36.8513868835154,-5.5944967006],{
      draggable: true
    }).addTo(this.map).bindPopup("FutHead S.L Villamartín").openPopup();
    this.newMarker = marker([40.730610,-73.935242],{
      draggable: true
    }).addTo(this.map).bindPopup("FutHead S.L Central").openPopup();
    this.newMarker = marker([40.4183083,-3.70275],{
      draggable: true
    }).addTo(this.map).bindPopup("FutHead S.L Madrid").openPopup();
  }
  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["/home"], navigationextras);
  }
 
  callJoint() {
    
    this.callNumber.callNumber(this.phone, true);
    this.callNumber.isCallSupported()
    .then(function (response) {
        if (response == true) {
            console.log("llamando")
        }
        else {
            // do something else
            console.log("No responde")
        }
    })
}
  ngOnInit() {
  }
  navigateToInicio() {
    this.router.navigate(["/home"]);
  }
}
