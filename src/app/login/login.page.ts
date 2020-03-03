import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
//export class LoginPage implements OnInit {
export class LoginPage {

  validations_form: FormGroup;
  errorMessage: string = '';

    validation_messages = {
    'email': [
      { type: 'required', message: 'Ingrese correo electrónico.' },
      { type: 'pattern', message: 'Ingrese un correo electrónico valido.' }
    ],
    'password': [
      { type: 'required', message: 'Ingrese contraseña.' },
      { type: 'minlength', message: 'La contraseña debe de tener al menos 5 carácteres.' }
    ]
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(["/home"]);
    }, err => {
      this.errorMessage = err.message;
      console.log(err)
    })
  }

  goRegisterPage(){
    this.router.navigate(["/register"]);
  }
  goHome(){
    this.router.navigate(["/home"]);
  }
}