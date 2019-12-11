import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private firestoreService: FirestoreService,private router:Router, private activatedRoute: ActivatedRoute) {
    
  } 

  ngOnInit() {
  }
  navigateToInicio() {
    this.router.navigate(["/home"]);
  }
}
