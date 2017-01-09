import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import  { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular'
//plugin
import {Camera} from 'ionic-native'
import {Crop} from 'ionic-native'
//Service
import {DataService} from '../../providers/data-service'
import {CommonsService} from '../../providers/commons-service'
import {UserService} from '../../providers/user-service'
//pages
import {HomePage} from '../home/home'
/*
  Generated class for the CameraPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-camera-page',
  templateUrl: 'camera-page.html',
  providers:[DataService,CommonsService,UserService]
})
export class CameraPagePage {

  public option = {
    quality:100,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth:900,
    targetHeight:900,
    correctOrientation: true,
  }
  public image
  public postTitle
  public userId
  public theme
  constructor(public navcontrol: NavController,
    public createPost:DataService,public uriToBlob:CommonsService,
    private navparams:NavParams, private getUserId:UserService,
    private loadingcontrol:LoadingController,private toastcontrol:ToastController ) {
      var _self = this
      _self.theme = navparams.get('theme')
      _self.userId = getUserId.getUserId()

    }

  ionViewDidLoad() {
    var _self = this
    Camera.getPicture(_self.option).then(imageUrl => {
      Crop.crop(imageUrl,{quality:100}).then(imageUrlCrop =>{
        _self.image  = imageUrlCrop
      },error =>{
      })
    },error=>{
      if(error){
        _self.navcontrol.setRoot(HomePage,{uid:_self.userId})
      }
    })
  }
  goNewPicture(){
    var _self = this
    Camera.getPicture(_self.option).then(imageUrl => {
      Crop.crop(imageUrl,{quality:100}).then(imageUrlCrop =>{
        _self.image  = imageUrlCrop
      },error =>{
      })
    },error =>{
      if(error){
        _self.navcontrol.setRoot(HomePage,{uid:_self.userId})
      }
    })
  }
  publishPost(){
    var _self = this
    if (!_self.postTitle){

      let toast = _self.toastcontrol.create({
        message: 'Typing the message for the post',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    }else{
      _self.uriToBlob.converterURItoBlob(_self.image).subscribe(dataUri =>{
            _self.createPost.createPostsDataService(_self.userId,_self.theme,_self.postTitle,dataUri)
      },error=>{
        console.log(error)
      })

      let loading = _self.loadingcontrol.create({
        content:'Publishing ...'
      });
      loading.present();
      setTimeout(()=>{
        _self.navcontrol.setRoot(HomePage,{uid:_self.userId})
      },3000);
      setTimeout(()=>{
        loading.dismiss()
      },3000)
    }
  }
}
