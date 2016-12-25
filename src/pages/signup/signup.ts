import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators,FormBuilder } from '@angular/forms'
import { ToastController } from 'ionic-angular';
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
  public option = {
    quality:100,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    cameraDirection: 1,
    targetWidth:350,
    targetHeight:350,
    correctOrientation: true,
  }
  public formRegister
  public image
  public fileuriBlob
  constructor(public navcontrol: NavController,public builder:FormBuilder ,
    public registerUser:AuthService,public uriToBlob:CommonsService,public toastcontrol:ToastController) {
    var _self = this;
    _self.formRegister = builder.group({
      email:['',Validators.required],
      password:['',Validators.required],
      nickname:['',Validators.required],
      birthday:['',Validators.required]
    });
    // starting image variable
    // _self.image = "S"
  }

  // ionViewDidLoad() {}
  goRegister(form){
    var _self = this;
    var email = form.value.email
    var password = form.value.password
    var nickname = form.value.nickname
    var birthday = form.value.birthday
    // mock
    // var email = 'teste@teste.com'
    // var password = 'teste@123'
    // var nickname = 'teste'
    // var birthday = '12/12/2012'

    if((email=="") || (password=="") || (nickname=="") || (birthday=="")){
      //showing errorMessage
      let toast = _self.toastcontrol.create({
        message:'Please fill all fields',
        duration:1500,
        position:'top'
      })
      toast.present()
    }else{
      _self.uriToBlob.converterURItoBlob(_self.image).subscribe(blobData =>{
          _self.registerUser.createUser(email,password,nickname,birthday,blobData)
      })
    }
  }

  goLogin(){
    var _self = this
    _self.navcontrol.push(LoginPage)
  }
  goGallery(){
    var _self = this
    Camera.getPicture(_self.option).then(imageUrl => {
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
