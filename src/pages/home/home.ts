import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
//pages
import { PostViewPage } from'../post-view/post-view'
import { UserViewPage } from'../user-view/user-view'
//Service
import { DataService } from '../../providers/data-service'
import { CommonsService } from '../../providers/commons-service'
//pipes
import {TimeAgoPipe} from '../../pipes/timeago-pipe'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[DataService,CommonsService],
})
export class HomePage {
  public post_data
  public userId
  constructor(public navcontrol: NavController,public navparams:NavParams,
    public usersPostsData:DataService,public commonsLikeService:CommonsService) {
      var _self = this
      _self.userId = _self.navparams.get('uid')
    }

    ionViewDidLoad() {
      var _self = this
      _self.userId = _self.navparams.get('uid')
      //side menu profile data
      setTimeout(()=>{
        _self.usersPostsData.retrievePostsDataService(_self.userId).subscribe(posts=>{
           _self.post_data = posts
        })
      },2000)
    }
    ionViewWillEnter(){
      var _self = this
     _self.usersPostsData.retrievePostsDataService(_self.userId).subscribe(posts=>{
        _self.post_data = posts
     })
  }
  //button like
  toggleLike(post,postId){
    var _self = this
    if(post.liked){
      post.likesCount--;
      _self.commonsLikeService.removeLikeButton(postId, _self.userId)
    }else{
      post.likesCount++;
      _self.commonsLikeService.addLikeButton(postId,_self.userId)
    }
    post.liked = !post.liked
  }
  //go to userview page
  viewUser(userId){
    var _self = this;
    _self.navcontrol.push(UserViewPage,{uid:userId})
  }
  //go to postview page
  viewPost(postId){
    var _self = this;
    _self.navcontrol.push(PostViewPage,{pid:postId})
  }

}
