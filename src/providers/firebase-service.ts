import { Injectable } from '@angular/core';
import firebase from 'firebase'
// import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseService {
  public auth:any
  public db:any
  public storage:any
  public credencial:any
  public provider:any
  constructor() {
    {
        var _self = this;
        var config = {
          apiKey: "AIzaSyDvvYgdUj1-WxMZk1UD_Dxx-KLM-lPuZ4o",
          authDomain: "tstenv-a88df.firebaseapp.com",
          databaseURL: "https://tstenv-a88df.firebaseio.com",
          storageBucket: "tstenv-a88df.appspot.com",
          messagingSenderId: "135573283018"
        };
        firebase.initializeApp(config);
        // firabase basic function
        _self.auth = firebase.auth() // authentication
        _self.db = firebase.database().ref('/') // database real time
        _self.storage = firebase.storage().ref('/') // storage
        _self.provider = new firebase.auth.FacebookAuthProvider(); // provider facebook
        _self.credencial = firebase.auth.FacebookAuthProvider; // facebook credential
      }
  }
}
