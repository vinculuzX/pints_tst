import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//pages
import { CameraPagePage } from '../camera-page/camera-page'
//Service
import { CommonsService } from '../../providers/commons-service'

/*
  Generated class for the MissionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mission-page',
  templateUrl: 'mission-page.html',
  providers:[CommonsService]
})
export class MissionPagePage {
  public missionsInfo
  public expired
  constructor(public navcontrol: NavController,public missionData : CommonsService) {}

  ionViewDidLoad() {
    var _self = this
    _self.missionData.retrieveMissionService().subscribe(missions => {
      _self.missionsInfo = missions
      console.log(missions)
    })
  }
  goCamera(theme){
    var _self = this
    _self.navcontrol.push(CameraPagePage,{theme:theme})
  }
}
