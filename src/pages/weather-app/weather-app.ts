import { Component, ViewChild, ElementRef} from '@angular/core';
import {ApiProvider} from '../../providers/api/api';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { LeafletPage } from '../leaflet/leaflet';
//import leaflet from "../leaflet/leaflet";
import leaflet from 'leaflet';


@IonicPage()
@Component({
  selector: 'page-weather-app',
  templateUrl: 'weather-app.html',
  })

export class WeatherAppPage {
  @ViewChild('rainviewerMap')mapContainer: ElementRef;
  rainviewerMap:any;
  boxData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
    this.refresh_data();
    this.loadRainViewerMap();
  }

  loadRainViewerMap() {
    this.rainviewerMap = leaflet.map('rainviewerMap').fitWorld();
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'openSense WeatherApp',
      maxZoom: 18
    }).addTo(this.rainviewerMap)
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
      console.log('Refresh was clicked');
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

refresh_data(){
  this.api.getData().subscribe(res => {
    console.log(res);
    this.boxData = res;
  console.log('Refresh was clicked');
  })
}

/*
auto update?
task = setInterval(() => {
  this.refresh_data();
}, 1000000);
*/

  locate_click() {
    // popover leaflet.html
  }
    presentPopover(myEvent){
      let popover = this.popoverCtrl.create(LeafletPage, {}, {cssClass: 'custom_popover'});
      popover.present({
        ev: myEvent
      });
    }

  refresh_click() {
    console.log('Refresh was clicked');
  }


  search_click() {
    console.log('Search was clicked');
  }


}
