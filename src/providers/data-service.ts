import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// firebase Service
import {FirebaseService} from './firebase-service'


/*
  Generated class for the DataService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {
  constructor(private postData:FirebaseService) {}
createPostsDataService(userId:string,theme:string,title:string,file:any){
  var _self = this
  //commons variables
  var timestamp = -1 * (Number(new Date()));
  var Filename = userId + '_' + timestamp * - 1 + '.jpg'
  var metadata = {
    contentType: 'image/jpeg',
  };
  // variable
  var postPublishDatabase = _self.postData.db.child('posts')
  var userPublishDatabase = _self.postData.db.child('users').child(userId).child('postposted')
  var userPublishStorage = _self.postData.storage.child('images').child(userId).child('posts').child(Filename)
  // prepare to storaging
  var uploadImage = userPublishStorage.put(file)
  uploadImage.on('state_changed',(snapshot)=>{
  },error =>{
  },()=>{
    var downloadURL = uploadImage.snapshot.downloadURL;
     postPublishDatabase.push({
       uid:userId,
       title:title,
       photoUrl:downloadURL,
       date_posted:timestamp,
       theme:theme,
       commentCount:0,
       likesCount:0
     }).then(data=>{
       var post_key = data.key
       userPublishDatabase.child(post_key).set({
         photoUrl:downloadURL,
         date_posted:timestamp
       })
     })
  })
}
  retrievePostsDataService(userId){
    var _self = this
    //database variable
    var postsRetrieve = _self.postData.db.child('posts')
    var postsUsersProfile = _self.postData.db.child('users');
    //result query
    return new Observable(observer =>{
      var dataServiceArray = []
      var dataQueryResult
      postsRetrieve.orderByChild('date_posted').on('child_added',posts_result =>{
        postsUsersProfile.child(posts_result.val().uid).child('profile').on('value',profile_result => {
          postsUsersProfile.child(userId).child('postliked').child(posts_result.key).once('value', likepost_result => {
            //variable loop array
             dataQueryResult = Object.assign({},{key : posts_result.key},{uid : posts_result.val().uid},
                          {photoUrl: posts_result.val().photoUrl},
                          {theme:posts_result.val().theme },{title:posts_result.val().title},{time:posts_result.val().date_posted},
                          {commentCount:posts_result.val().commentCount},{likesCount:posts_result.val().likesCount},
                          {nickname:profile_result.val().nickname},{avatarUrl:profile_result.val().avatarUrl},
                          {liked:likepost_result.val() == null ? false : true}
            )
            dataServiceArray.push(dataQueryResult)

          },error =>{
            console.error(error)
          })
        },error =>{
          console.error(error)
        })

      },error =>{
        console.error(error)
      })
      observer.next(dataServiceArray)
    })
  }
  retrivePostsViewData(postId:string){
    var _self = this
    //database variable
    var postsView = _self.postData.db.child('posts').child(postId)
    var postsViewProfile = _self.postData.db.child('users')
    // result query
    return new Observable(observer=>{
      postsView.once('value',posts_result=>{
        postsViewProfile.child(posts_result.val().uid).child('profile').on('value',profile_result=>{
          var postViewArray = []
          var postViewQueryResult
          postViewQueryResult = Object.assign({},{uid:posts_result.val().uid},{title:posts_result.val().title},
                          {photoUrl: posts_result.val().photoUrl},
                          {theme:posts_result.val().theme },{title:posts_result.val().title},{time:posts_result.val().date_posted},
                          {nickname:profile_result.val().nickname},{avatarUrl:profile_result.val().avatarUrl}
          )
          postViewArray.push(postViewQueryResult)
          observer.next(postViewArray)
        },error =>{
          console.log(error)
        })
      },error =>{
        console.log(error)
      })
    })

  }
  retrivePostsDataFollowing(postId:string,postUid:string){}
  // creating post comments
  createCommentPost(postId:string,userId:string,dataComment:string){
    var _self = this;
    var timestamp = -1 * (Number(new Date()))
    var postComment = _self.postData.db.child('comments').child(postId)
    var postCommentCount = _self.postData.db.child('posts').child(postId).child('commentCount')
    var userProfileComment = _self.postData.db.child('users').child(userId).child('postcommented')
    postComment.push({
      message:dataComment,
      uid:userId,
      time:timestamp
    }).then((data)=>{
      //Comment User
      var post_key  = data.key
      userProfileComment.child(postId).child(post_key).set({
        message:dataComment
      })
      // commentCount
      postCommentCount.transaction(commentCount=> {
        return commentCount + 1
      })

    },error =>{
      console.error(error)
    })
  }

  //deleting comments posts
  removeCommentsPost(postId:string,userId:string,commentId:string){
    var _self = this;
    var postComment = _self.postData.db.child('comments').child(postId).child(commentId)
    var postCommentCount = _self.postData.db.child('posts').child(postId).child('commentCount')
    var removeProfileComment = _self.postData.db.child('users').child(userId).child('postcommented').child(postId).child(commentId)

      postComment.remove()
      removeProfileComment.remove()
      postCommentCount.transaction(countComment => {
        return countComment  - 1
      })

  }
  // retriving post comments
  retriveCommentPost(postId){
  return new Observable(observer=>{
    var _self = this
    var postViewComments = _self.postData.db.child('comments').child(postId)
    var usersProfileComment = _self.postData.db.child('users')
    var CommentView
    var CommentViewArray =[]
      postViewComments.on('child_added',comment_result=>{
        usersProfileComment.child(comment_result.val().uid).child('profile').on('value',profile_comment=>{
          CommentView = Object.assign({},{commentId:comment_result.key},{message:comment_result.val().message},
                            {time:comment_result.val().time},{nickname:profile_comment.val().nickname},
                            {uid:comment_result.val().uid},{deleteCommented:false}
          )
          CommentViewArray.push(CommentView)
          observer.next(CommentViewArray)
        },error =>{
          console.error(error)
        })

      },error =>{
        console.error(error)
      })
    })
  }
}
