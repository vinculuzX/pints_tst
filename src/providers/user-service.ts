import { Injectable,EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// firebase Service
import {FirebaseService} from './firebase-service'

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  private userDataValue = this.userData.db
  // private emiterResultEvent =  new EventEmitter()
  constructor(private userData:FirebaseService) {}

//get user id
getUserId(){
  var _self = this
  var userProfileId = _self.userData.auth.currentUser
  return  userProfileId.uid
}
//save the user data
  saveRegisterDataUser(userId:string,nickname:string,birthday:string,file:string){
    var _self = this
    console.log(nickname,birthday,file)
    var registerUserProfile = _self.userDataValue.child('users').child(userId).child('profile')
    // inserting collection on database
    registerUserProfile.set({
      firstname:"",
      lastname:"",
      nickname:nickname,
      avatarUrl:file,
      birthday:birthday
    })
  }
//retriving user data profile for side menu
  retrieveProfileMenu(userId:string){
    var _self = this;
    var profileUserMenu = _self.userDataValue.child('users').child(userId).child('profile')
    //retrive profile collection
     return new Observable(observer => {
       profileUserMenu.on('value', profile=>{
         var profileDataArray =  []
         var profileQuery = profile.val()
         profileDataArray.push(profileQuery)
         observer.next(profileDataArray)
      },(error)=>{
        console.error('Error:',error)
      })
    })
  }
//retrieve user profile for ProfileView
  retrieveProfile(userId:string){
    var _self = this;
    var profileUser = _self.userDataValue.child('users').child(userId).child('profile')
     return new Observable(observer => {
       profileUser.on('value',profile =>{
          var profileData = profile.val()
          observer.next(profileData)
       },(error)=>{
         console.error('Error:',error)
       })
     })
  }
//updating user profile data
  updateDataUser(userId:string,firstname:string,lastname:string,nickname:string,birthday:string){
      var _self = this;
      var updateprofileUser = _self.userDataValue.child('users').child(userId).child('profile')
      updateprofileUser.update({
        firstname:firstname,
        lastname:lastname,
        nickname:nickname,
        birthday:birthday
      },(error)=>{
        if (error == null){
          console.log("Update has been success")
        }
      })
  }
}
