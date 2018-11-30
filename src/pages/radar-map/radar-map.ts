import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {repeat} from "rxjs/operator/repeat";
import {delay} from "rxjs/operator/delay";

/**
 * Generated class for the RadarMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-radar-map',
  templateUrl: 'radar-map.html',
})
export class RadarMapPage {

  @ViewChild('rainviewerMap') mapContainer: ElementRef;
  rainviewerMap: any;
  overlay: any;
  bounds: any;
  timeArray: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadarMapPage');
    this.loadRainViewerMap();
  }

  loadRainViewerMap() {
    this.rainviewerMap = leaflet.map('rainviewerMap').setView([0, 0], 6);
    let sampleDate = new Date();
    let hours = 6; //sampleDate.getHours();
    if (hours > 7 && hours < 18) {
      leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: "<a href=\"http://github.com/Albertios\" title=\"one of the creators of the app\">Albertios</a>",
        maxZoom: 18
      }).addTo(this.rainviewerMap);
      this.setBounds();
      this.loadOverLay();
    }else {
      leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: "<a href=\"http://github.com/Albertios\" title=\"one of the creators of the app\">Albertios</a>",
        maxZoom: 18
      }).addTo(this.rainviewerMap);
      this.setBounds();
    }
    this.getRemoteData();
  }

  setBounds() {
    this.bounds = new leaflet.LatLngBounds(//this.rainviewerMap.getBounds();
      new leaflet.LatLng(-180.0,-180.0),
      new leaflet.LatLng(180.0,180.0));
    //leaflet.rectangle(this.bounds).addTo(this.rainviewerMap);
    this.rainviewerMap.fitBounds(this.bounds);
  }

  getRemoteData(){
    this.http.get('https://tilecache.rainviewer.com/api/maps.json')
      .toPromise().then( response => {
          this.timeArray = response[0];
          console.log(this.timeArray.length);
          this.loadOverLay();

    })
  }

loadOverLay(){
        this.overlay = new leaflet.ImageOverlay("https://tilecache.rainviewer.com/v2/composite/"+this.timeArray+"/8000.png?color=5", this.bounds, {
          opacity: 0.5,
          interactive: true,
          attribution: "<a href=\"http://www.rainviewer.com\" title=\"radar data from RainViewer\">RainViewer</a>"
        }).addTo(this.rainviewerMap);
}


}
