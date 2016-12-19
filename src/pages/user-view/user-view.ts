import { Component } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
//Service
import {UserService} from '../../providers/user-service'

/*
  Generated class for the UserView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-view',
  templateUrl: 'user-view.html',
    providers:[UserService]
})
export class UserViewPage {
  public profiles
  public userId
  constructor(public navCtrl: NavController,public profileUserData:UserService,public Navparams:NavParams) {
    var _self = this
    _self.userId = Navparams.get('uid')
  }

  ionViewDidLoad() {
    var _self = this;
    _self.profileUserData.retrieveProfileMenu(_self.userId).subscribe((profile)=>{
      _self.profiles = profile
    })
  }
}
