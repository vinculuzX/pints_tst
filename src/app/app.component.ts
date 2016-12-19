import { Component,ViewChild} from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ScreenOrientation } from 'ionic-native';
import  { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
// pages
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage} from '../pages/edit-profile/edit-profile';
import { PostViewPage } from '../pages/post-view/post-view';
import { UserViewPage } from '../pages/user-view/user-view';
import { MissionPagePage } from '../pages/mission-page/mission-page';
import { CameraPagePage } from '../pages/camera-page/camera-page';
// services
import {FirebaseService} from '../providers/firebase-service'
import {UserService} from '../providers/user-service'


@Component({
  templateUrl: 'app.html',
  queries:{
    navigation: new ViewChild("content")
  },
  providers:[FirebaseService,UserService]
})
export class MyApp {
  public rootPage:any
  public pages = [
    {
      title:'Profile',
      template:ProfilePage
    },
    {
      title:'Mission',
      template:MissionPagePage
    },
    {
      title:'Logout',
      template:null
    }
  ]
  public navigation:any
  public profiles:any
  public userId:string
  constructor(platform: Platform,public changeStatusUser:FirebaseService,
    DataQueryUser:UserService,loadingcontrol:LoadingController,
    toastcontrol:ToastController) {
    //Authentication User
    var _self = this;
    var dataQueryStatusUser = changeStatusUser.auth
    var DataUserProfile = changeStatusUser.db
    dataQueryStatusUser.onAuthStateChanged((login)=>{
      if(login){
        _self.userId = login.uid // user id parameter
        let loading = loadingcontrol.create({
          content:'loading ... '
        });
        loading.present();
        setTimeout(()=>{
          _self.navigation.setRoot(HomePage,{uid:_self.userId})
        },2000);
        setTimeout(()=>{
          loading.dismiss()
        },3000)
        //side menu profile data
        DataQueryUser.retrieveProfileMenu(_self.userId).subscribe((profile)=>{
          _self.profiles = profile
        })
      }else{
        //back to start page
        //application did not get authentication
        _self.navigation.setRoot(LoginPage)
      }
    },(error)=>{
      let toast = toastcontrol.create({
        message: error,
        duration: 3000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
        console.log(ErrorEvent);
      });
      toast.present();
    })


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      // set to either landscape
      if (platform.is('ios') || platform.is('android')) {
        // set to either landscape
        ScreenOrientation.lockOrientation('portrait');
      }
    });
  }
  openPage(Page){
    var _self = this
    if(Page == null){
      _self.changeStatusUser.auth.signOut().then(()=>{
      },error=>{
      })
    }else{
      _self.navigation.push(Page,{uid:_self.userId})
    }
  }
  viewUser(){
    var _self = this
    _self.navigation.push(ProfilePage,{uid:_self.userId})
  }
}
