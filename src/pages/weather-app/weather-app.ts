import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { LeafletPage } from '../leaflet/leaflet';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create( LeafletPage, {} , { cssClass: 'custom_popover' });
    popover.present({
      ev: myEvent
    });
  }

  refresh_click() {
    console.log('Refresh was clicked');
  }

  locate_click() {
    console.log('Locate was clicked');
  }

  search_click() {
    console.log('Search was clicked');
  }


}
