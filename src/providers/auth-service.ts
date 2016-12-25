import { Injectable } from '@angular/core';
import  { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
// Service Firebase
import { FirebaseService } from './firebase-service'
import { UserService } from './user-service'
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  private accountUser
  constructor(private userAuth:FirebaseService,private loadingcontrol:LoadingController,
    private navigation:NavController,private toastcontrol:ToastController,private DataUserProfile:UserService) {
       var _self=this;
        _self.accountUser = userAuth.auth
    }
//loging user
loginUser(login:string,password:string){
      var _self = this;
      var loginAccount = _self.accountUser
      //verifying on database the user data
      // user authentication on firebase
      loginAccount.signInWithEmailAndPassword(login,password).catch((error)=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        var toastMessage:string;
        switch(error.code){
          case"auth/invalid-email":
          toastMessage = error.message
          break;
          case"auth/user-not-found":
          toastMessage = error.message
          break;
          case"auth/wrong-password":
          toastMessage = error.message
          break;
        }
        //showing errorMessage
        let toast = _self.toastcontrol.create({
          message:toastMessage,
          duration:3500,
          position:'bottom'
        })
        toast.present()
    }).then((sucess)=>{
        if(sucess){
        console.log('Success Login user' , loginAccount.currentUser.uid)
        // _self.navigation.setRoot(homepageroot,{uid:loginAccount.currentUser.uid})
        }

    })
  }


  // creating new user on application
  createUser(login:string, password:string,nickname:string,birthday:string,file:any){
    var _self = this;
    var createProfile = _self.accountUser
          console.log('teste');
                    console.log(file);
    createProfile.createUserWithEmailAndPassword(login,password).catch((error)=>{
      console.log('teste');
      var errorCode = error.code;
      var errorMessage = error.message;
      var toastMessage:string;
      switch(error.code){
        case"auth/email-already-in-use":
        toastMessage = error.message
        break;
        case"auth/invalid-email":
        toastMessage = error.message
        break;
        case"auth/operation-not-allowed":
        toastMessage = error.message
        break;
      }
      //showing errorMessage
      let toast = _self.toastcontrol.create({
        message:toastMessage,
        duration:3500,
        position:'bottom'
      })
      toast.present()
      }).then(()=>{
        var userId  = _self.accountUser.currentUser.uid
        var avatar = userId + '_' + 'avatar.jpeg'
        var uploadImage = _self.userAuth.storage.child('images').child(userId).child('avatar').child(avatar).put(file)
        console.log('teste');
          uploadImage.on('state_changed',(snapshot)=>{
          },error =>{
          },()=>{
            var downloadURL = uploadImage.snapshot.downloadURL;
            _self.DataUserProfile.saveRegisterDataUser(userId,nickname,birthday,downloadURL)
            // _self.navigation.setRoot(homepageroot,{uid:userId})
        })
    })
}

  //verify user authentication status
  // verifyChangeStatusAuth(){
  //   var _self = this;
  //   _self.accountUser.onAuthStateChanged((login)=>{
  //     if(login){
  //       var userId = login.uid // user id parameter
  //
  //       let loading = _self.loadingcontrol.create({
  //         content:'loading ... '
  //       });
  //       loading.present();
  //       setTimeout(()=>{
  //         // _self.navigation.setRoot(homepageroot)
  //       },2000);
  //       setTimeout(()=>{
  //         loading.dismiss()
  //       },3000)
  //       //side menu profile data
  //       _self.DataUserProfile.retrieveProfileMenu(userId)
  //     }else{
  //       //back to start page
  //       //application did not get authentication
  //       // _self.navigation.setRoot(starterpageroot)
  //     }
  //   },(error)=>{
  //     let toast = _self.toastcontrol.create({
  //       message: error,
  //       duration: 3000,
  //       position: 'bottom'
  //     });
  //     toast.onDidDismiss(() => {
  //       console.log(ErrorEvent);
  //     });
  //     toast.present();
  //   })
  //
  // }


// realizing user logout
  // logoutUser(){
  //   var _self = this;
  //   _self.accountUser.signOut().then(()=>{
  //   },(error)=>{
  //       console.log(error)
  //   })
  // }

  // recover user Password
  recoverPassword(login:string){
    var _self = this;
    _self.accountUser.sendPasswordResetEmail(login).then(()=>{
      let toast = _self.toastcontrol.create({
        message: 'email sent to redefinition',
        duration: 3000,
        position: 'top'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    },(error)=>{
      let toast = _self.toastcontrol.create({
        message: error,
        duration: 3000,
        position: 'top'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    })
  }
}
