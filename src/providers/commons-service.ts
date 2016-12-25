import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx'
//plugins
import {File} from  'ionic-native'
declare var cordova: any;
//Service
import { FirebaseService } from './firebase-service'

/*
  Generated class for the CommonsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommonsService {

  constructor(public commonsServiceData:FirebaseService) {
  }
  addLikeButton(postId:string,userId:string){
    var _self = this
    var addLikePost = _self.commonsServiceData.db.child('likes').child(postId).child(userId)
    var addLikeCount = _self.commonsServiceData.db.child('posts').child(postId).child('likesCount')
    var addLikeUser = _self.commonsServiceData.db.child('users').child(userId).child('postliked').child(postId)
    addLikeCount.transaction(countLike => {
      return countLike + 1
    })
    addLikePost.set({
      uid:userId
    })
    addLikeUser.set({
      pid:postId
    })
  }
  removeLikeButton(postId:string,userId:string){
    var _self = this
    var removeLikePost = _self.commonsServiceData.db.child('likes').child(postId).child(userId)
    var removeLikeCount = _self.commonsServiceData.db.child('posts').child(postId).child('likesCount')
    var removeLikeUser = _self.commonsServiceData.db.child('users').child(userId).child('postliked').child(postId)
    removeLikeCount.transaction(countLike => {
      return countLike - 1
    })
    removeLikePost.remove()
    removeLikeUser.remove()

  }

  retrieveMissionService(){
    var _self = this
    var retrieveMission = _self.commonsServiceData.db.child('missions')
    // executing query
  return new Observable(observer=>{
      retrieveMission.once('value', missions_result => {
        var missionResultArray = []
        missionResultArray.push(missions_result.val())
        observer.next(missionResultArray)
      })
    })
  }
  converterURItoBlob(imageUri){
      return new Observable(observer=>{
      var sourceDirectory = imageUri.substring(0,imageUri.lastIndexOf('/') + 1)
      var sourceFilename = imageUri.substring(imageUri.lastIndexOf('/') + 1,imageUri.length)
      sourceFilename = sourceFilename.split('?').shift()
      File.copyFile(sourceDirectory,sourceFilename,cordova.file.dataDirectory,sourceFilename).then((result:any) =>{
        File.readAsArrayBuffer(cordova.file.dataDirectory,result.name).then((fileUri) =>{
            console.log(fileUri)
            var Bloby = new Blob([fileUri],{type:'image/jpeg'})
            observer.next(Bloby)
        },(error) =>{
          console.log(error);
        })
      },(error) =>{
        console.log(error);
      })
    })
  }

}
