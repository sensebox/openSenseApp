import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer} from "leaflet";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'sensify-map.html',
})
export class SensifyMapPage {

  options : GeolocationOptions;
  currentPos : Geoposition;
  public posMarker;
  public userLng: number;
  public userLat: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public LM: LeafletModule, private geolocation: Geolocation) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.getUserPosition();
  }

  // Get the current location
  getUserPosition(){
    this.geolocation.getCurrentPosition(this.options)
      .then((pos: Geoposition) => {
        this.currentPos = pos;
        this.userLat = this.currentPos.coords.latitude;
        this.userLng = this.currentPos.coords.longitude;
        console.log(pos);
        this.loadPositionOnMap();
      }, (err: PositionError) => {
        console.log("ERROR: " + err.message)
      })
  }

  // load the map, load the layer
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

  // Center the map on the user-position
  loadPositionOnMap(){
    if(this.posMarker != undefined){
      this.map.removeLayer(this.posMarker);
    }
    console.log(this.posMarker);
    this.map.panTo(new L.LatLng(this.userLat, this.userLng));
    this.posMarker = L.marker([this.userLat, this.userLng]).on('click', () => {
      alert('user: lat:'+ this.userLat +", lon:"+ this.userLng);
    });
    this.posMarker.addTo(this.map);
  }

  // Watch the user position
  subscription = this.geolocation.watchPosition()
    .subscribe(position => {
      this.userLat = position.coords.latitude;
      this.userLng = position.coords.longitude;
      this.loadPositionOnMap();
      console.log(position.coords.longitude + ' ' + position.coords.latitude);
    });
}
