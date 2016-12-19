import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
//pages
import {EditProfilePage} from '../edit-profile/edit-profile'
//Service
import {UserService} from '../../providers/user-service'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers:[UserService]
})
export class ProfilePage {
  public userId:string
  public profiles:any
  constructor(public navcontrol: NavController,public profileUserData:UserService,public navparams:NavParams) {
    var _self = this;
    _self.userId = navparams.get('uid')
  }
  ionViewDidLoad() {
    var _self = this;
    _self.profileUserData.retrieveProfileMenu(_self.userId).subscribe((profile)=>{
      _self.profiles = profile
    })
  }
  goEdit(){
    var _self=this;
    _self.navcontrol.push(EditProfilePage,{uid:_self.userId})
  }

}
