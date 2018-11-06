import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the WeatherAppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-weather-app',
  templateUrl: 'weather-app.html',
  })

export class WeatherAppPage {
  boxData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
    this.refresh_data();
  }

  refresh_data(){
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
    console.log('Refresh was clicked');
    })
  }

  /* auto update?
  task = setInterval(() => {
    this.refresh_data();
  }, 1000000);
*/

  locate_click(){
    console.log('Locate was clicked');
  }
  
  search_click(){
    console.log('Search was clicked');
  }


}
