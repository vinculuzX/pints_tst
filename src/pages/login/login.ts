import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms'
import { AlertController } from 'ionic-angular';
//pages
import {SignupPage} from '../signup/signup'
import {HomePage} from '../home/home'
//services
import {AuthService} from '../../providers/auth-service'

/*
Generated class for the Login page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class LoginPage {
  public formLogin
  constructor(public navcontrol: NavController,public builder:FormBuilder,
    public AuthUser:AuthService,public alertcontrol: AlertController) {
      var _self = this;
      _self.formLogin = builder.group({
        email:['',Validators.required],
        password:['',Validators.required]
      })
    }
    ionViewDidLoad() {}
    // authentication Login
    onSubmitLogin(form){
      var _self = this
      var login = form.value.email
      var password = form.value.password
      // call authentication function
      _self.AuthUser.loginUser(login,password)
    }
    // going to Signup Page
    goSignup(){
      var _self = this
      _self.navcontrol.push(SignupPage)
    }
    recoveryPassword(){
      var _self = this
      let prompt = _self.alertcontrol.create({
        title: 'Recovery Password',
        message: "Enter with your register email to recovery your pass",
        inputs: [
          {
            name: 'email',
            placeholder: 'email@email.com'
          },
        ],
        buttons:[
          {
            text: 'Cancel',
            handler: data => {

            }
          },
          {
            text: 'Save',
            handler: data => {
              _self.AuthUser.recoverPassword(data.email)
            }
          }
        ]
      })
      prompt.present();
    }
  }
