import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
//pages
import {UserViewPage} from '../user-view/user-view'
//Service
import {DataService} from '../../providers/data-service'
import {UserService} from '../../providers/user-service'
//pipes
import {TimeAgoPipe} from '../../pipes/timeago-pipe'


/*
  Generated class for the PostView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post-view',
  templateUrl: 'post-view.html',
  providers:[DataService]
})
export class PostViewPage {
  postId
  userId
  profiles
  postView
  postComment
  commentView
  constructor(public navControl: NavController,public postViewData:DataService,public Navparams:NavParams,public logUserId:UserService) {
    var _self = this
    _self.postId = Navparams.get('pid')
    _self.userId = _self.logUserId.getUserId()
  }

  ionViewDidLoad() {
    var _self =  this
    //redering post
    _self.postViewData.retrivePostsViewData(_self.postId).subscribe(posts => {
      _self.postView = posts
    })
    //redering footer comment
    _self.logUserId.retrieveProfileMenu(_self.userId).subscribe(profile =>{
      _self.profiles = profile
    })
    // //rendering comments
    _self.postViewData.retriveCommentPost(_self.postId).subscribe(comments => {
      _self.commentView = comments
    })
  }
  userView(userId){
    var _self = this
    _self.navControl.push(UserViewPage,{uid:userId})
  }
  sendMessage(){
    var _self = this
    var comment = _self.postComment
    if(comment == undefined){
      console.warn('Please type your comment')
    }else{
      _self.postViewData.createCommentPost(_self.postId,_self.userId,comment)
       _self.postComment = ""
    }
  }
  deleteComment(commentId,deleteCommented){
    var _self = this
    _self.postViewData.removeCommentsPost(_self.postId,_self.userId,commentId)
  }
}
