import { Injectable } from '@angular/core';
import  { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
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
          case "auth/weak-password":
          toastMessage = error.message
          break;
        }
        //showing errorMessage
        let toast = _self.toastcontrol.create({
          message:toastMessage,
          duration:3500,
          cssClass:"toastError",
          position:'bottom'
        })
        toast.present()
    }).then((success)=>{
        if(success){
        console.log('Success Login user' , loginAccount.currentUser.uid)
        }
    })
  }


  // creating new user on application
  createUser(login:string, password:string,nickname:string,birthday:string,file:any){
    var _self = this;
    var createProfile = _self.accountUser
    createProfile.createUserWithEmailAndPassword(login,password).catch((error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      var toastMessage:string;
      switch(error.code){
        case"auth/email-already-in-use":
        toastMessage = errorCode + ' : ' + error.message
        break;
        case"auth/invalid-email":
        toastMessage = errorCode + ' : ' + error.message
        break;
        case"auth/operation-not-allowed":
        toastMessage = errorCode + ' : ' + error.message
        break;
      }
      //showing errorMessage
      let toast = _self.toastcontrol.create({
        message:toastMessage,
        cssClass:"toastError",
        duration:1500,
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
        })
    })
}

// facebook login

loginFacebook(){
  var _self = this;
  var provider = _self.userAuth.provider
  var facebookConnect = _self.accountUser
  Facebook.login(["public_profile", "email"]).then((response) => {
    if (response.status === 'connected') {
      let facebookCredential = _self.userAuth.credencial.credential(response.authResponse.accessToken);
      facebookConnect.signInWithCredential(facebookCredential).catch((error)=> {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      }).then((authData)=>{
        var userId = authData.uid
        var nickname = authData.displayName
        var downloadURL = authData.photoURL
        _self.DataUserProfile.saveRegisterDataUser(userId,nickname," ",downloadURL)
      })

    } else {
      alert('Facebook login failed');
    }
  });
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
        cssClass:"toastSuccess",
        position: 'top'
      });
      toast.present();
    },(error)=>{
      let toast = _self.toastcontrol.create({
        message: error,
        duration: 3000,
        cssClass:"toastError",
        position: 'bottom'
      });
      toast.present();
    })
  }
}
