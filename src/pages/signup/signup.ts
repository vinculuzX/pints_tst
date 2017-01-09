import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators,FormBuilder } from '@angular/forms'
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//plugins
import {Camera} from 'ionic-native'
import {Crop} from 'ionic-native'
//pages
import { LoginPage } from '../login/login'
//services
import {AuthService} from '../../providers/auth-service'
import {CommonsService} from '../../providers/commons-service'

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [AuthService,CommonsService]
})
export class SignupPage {
  public formRegister
  public image
  public fileuriBlob
  constructor(public navcontrol: NavController,public builder:FormBuilder ,
    public registerUser:AuthService,public uriToBlob:CommonsService,
    public toastcontrol:ToastController,public alertcontrol:AlertController) {
    var _self = this;
    _self.formRegister = builder.group({
      email:['',Validators.required],
      password:['',Validators.required],
      nickname:['',Validators.required],
      birthday:['',Validators.required]
    });
  }

  // registering user on database
  goRegister(form){
    var _self = this;
    var email = form.value.email
    var password = form.value.password
    var nickname = form.value.nickname
    var birthday = ""
    if((email=="") || (password=="") || (nickname=="") || (birthday=="") || (_self.image== undefined)){
      //showing errorMessage
      let toast = _self.toastcontrol.create({
        message:'Please, fill all fields above',
        duration:3000,
        cssClass:"toastError",
        position:'bottom'
      })
      toast.present()
    }else{
      _self.uriToBlob.converterURItoBlob(_self.image).subscribe(blobData =>{
          _self.registerUser.createUser(email,password,nickname,birthday,blobData)
      })
    }
  }
  // go to login
  goLogin(){
    var _self = this
    _self.navcontrol.push(LoginPage)
  }

  // The user choice your avatar image
  // here it has two option
  // take a snap camera or pick the image from gallery
  avatarPicture(){
    var _self = this
    let alert = _self.alertcontrol.create({
      title: 'Choose avatar image',
      cssClass:'alertCss',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            _self.goPhotoGallery()
          }
        },
        {
          text: 'Camera',
          handler: () => {
            _self.goCamera()
          }
        }
      ]
    });
    alert.present();
  }

  // Camera Option from avatar
  private goCamera(){
      var _self = this
      var option = {
        quality:100,
        destinationType: Camera.DestinationType.FILE_URI,
        cameraDirection:1,
        targetWidth:1000,
        targetHeight:1000,
        correctOrientation: true,
      }
      Camera.getPicture(option).then(imageUrl => {
        Crop.crop(imageUrl,{quality:100}).then(imageCrop =>{
            _self.image = imageCrop
        },error => {
          console.log(error)
        })
      },error=>{
        console.log(error)
      })
  }

// Gallery image Option from avatar
private goPhotoGallery(){
    var _self = this
    var option = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      targetWidth:1000,
      targetHeight:1000,
      correctOrientation: true,
    }
    Camera.getPicture(option).then(imageUrl => {
      Crop.crop(imageUrl,{quality:100}).then(imageCrop =>{
          _self.image = imageCrop
      },error => {
        console.log(error)
      })
    },error=>{
      console.log(error)
    })
  }
}
