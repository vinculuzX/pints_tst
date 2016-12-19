import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the DatePipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'timeago'
})
@Injectable()
export class TimeAgoPipe {
  transform(value:any) {
    //month names
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    //creating variable times
    var minutes = 60
    var hours = 60 * minutes
    var days = 24 * hours
    var week = 7 * days
    var months = 30 * days
    var year = 12 * months
    // creating constants
    const postDate = (new Date(value)).valueOf()
    const dateNow = Date.now()
    const timeAgo = (Math.round(Math.abs(dateNow - postDate)/1000))
    // creating pipe condition

    if (timeAgo < minutes){
      return 'few seconds';
    }else{
      if(timeAgo < hours){
        return Math.round(timeAgo/minutes) + ' minutes';
      }else{
          if(timeAgo < days ){
            return Math.round(timeAgo/hours) + ' hours';
          }else{
            if(timeAgo < week ){
              return Math.round(timeAgo/days) + ' days';
            }else{
            if(timeAgo < months){
              return Math.round(timeAgo/week) + ' week';
            }else{
              return month[new Date(postDate).getMonth()] + '-' +  new Date(postDate).getFullYear()
            }
          }
        }
      }
    }
  }
}
