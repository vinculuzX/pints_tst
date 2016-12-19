import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
//Service
import { UserService } from '../../providers/user-service'

/*
  Generated class for the EditProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
  providers:[UserService]
})
export class EditProfilePage {

  public userId
  public profiles
  constructor(public navcontrol: NavController,public navParams:NavParams,
    public profileDataEdit:UserService) {
      var _self = this
      _self.userId = navParams.get('uid')
      _self.profileDataEdit.retrieveProfile(_self.userId).subscribe((profile)=>{
        _self.profiles = profile
      })
    }

  ionViewDidLoad() {}

  updateProfile(user){
    var _self = this;
    var firstname = user.firstname
    var lastname  = user.lastname
    var nickname = user.nickname
    var birthday = user.birthday
    // updating profile user
    _self.profileDataEdit.updateDataUser(_self.userId,firstname,lastname,nickname,birthday)
  }

}
