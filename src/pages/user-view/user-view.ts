import { Component } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
//pages
import {PostViewPage} from '../post-view/post-view'
//Service
import {UserService} from '../../providers/user-service'
import {CommonsService} from '../../providers/commons-service'

/*
  Generated class for the UserView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-view',
  templateUrl: 'user-view.html',
    providers:[UserService,CommonsService]
})
export class UserViewPage {
  public profiles
  public userId
  public posts
  constructor(public navcontrol: NavController,public profileUserData:UserService,public Navparams:NavParams) {
    var _self = this
    _self.userId = Navparams.get('uid')
  }

  ionViewDidLoad() {
    var _self = this;
    _self.profileUserData.retrieveProfileMenu(_self.userId).subscribe((profile)=>{
      _self.profiles = profile
    })
    //loading images
    _self.profileUserData.getImage(_self.userId).subscribe((images)=>{
      _self.posts = images
    })
  }
  goPost(postId){
      var _self=this;
      _self.navcontrol.push(PostViewPage,{pid:postId})
  }
}
