import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer} from "leaflet";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  options : GeolocationOptions;
  currentPos : Geoposition;

  constructor(public navCtrl: NavController, public navParams: NavParams, public LM: LeafletModule, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.getUserPosition();
  }

  // Get the current location
  getUserPosition(){
    this.geolocation.getCurrentPosition(this.options)
      .then((pos: Geoposition) => {
        this.currentPos = pos;
        console.log(pos);
        this.loadPositionOnMap();
      }, (err: PositionError) => {
        console.log("ERROR: " + err.message)
      })
  }

  map: L.Map;
  // Leafet Map options
  LeafletOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoom: 13,
    center: latLng(0, 0)
  };
  onMapReady(map: L.Map){
    this.map = map;
  }

  loadPositionOnMap(){
    console.log("Should change map position");
    this.map.panTo(new L.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude));
    let markerGroup = L.featureGroup();
    let marker = L.marker([this.currentPos.coords.latitude, this.currentPos.coords.longitude]).on('click', () => {
      alert('user: lat:'+ this.currentPos.coords.latitude +", lon:"+ this.currentPos.coords.longitude);
    });
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);
  }

}
