import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage} from '../pages/edit-profile/edit-profile';
import { PostViewPage } from '../pages/post-view/post-view';
import { UserViewPage } from '../pages/user-view/user-view';
import { MissionPagePage } from '../pages/mission-page/mission-page';
import { CameraPagePage } from '../pages/camera-page/camera-page';
//services
import {FirebaseService} from '../providers/firebase-service'
import {AuthService} from '../providers/auth-service'
import {UserService} from '../providers/user-service'
import {DataService} from '../providers/data-service'
import {CommonsService} from '../providers/commons-service'
//pipes
import {TimeAgoPipe} from '../pipes/timeago-pipe'


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    ProfilePage,
    EditProfilePage,
    PostViewPage,
    UserViewPage,
    MissionPagePage,
    CameraPagePage,
    TimeAgoPipe

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    ProfilePage,
    EditProfilePage,
    PostViewPage,
    UserViewPage,
    MissionPagePage,
    CameraPagePage
  ],
  providers: [

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseService,
    AuthService,
    UserService,
    DataService,
    CommonsService,
    TimeAgoPipe
  ]
})
export class AppModule {}
