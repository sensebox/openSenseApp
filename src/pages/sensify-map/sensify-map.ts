import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer} from "leaflet";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";
import { ApiProvider } from '../../providers/api/api';
import { Location } from "../../providers/model";

@IonicPage()
@Component({
  selector: 'sensify-page-map',
  templateUrl: 'sensify-map.html',
})
export class SensifyMapPage {

  options : GeolocationOptions;
  currentPos : Geoposition;
  public posMarker;
  public userLng: number;
  public userLat: number;
  public closestBoxes: any;
  public closestBoxesMarkers: any[] = [];
  public senseBoxesSet: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public LM: LeafletModule, private geolocation: Geolocation, private api: ApiProvider) {}

  public greenIcon = L.icon({
    iconUrl: '../../assets/imgs/greenMarker.png',

    iconSize:     [25, 40],
    iconAnchor:   [12, 40],
    popupAnchor:  [-3, -76]
  });

  public redIcon = L.icon({
    iconUrl: '../../assets/imgs/redMarker.png',

    iconSize:     [40, 40],
    iconAnchor:   [20, 37],
    popupAnchor:  [-3, -76]
  });

  public posIcon = L.icon({
    iconUrl: '../../assets/imgs/positionMarker.png',

    iconSize: [50, 50],
    iconAnchor: [25, 48],
    popupAnchor: [-3, -76]
  });

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
        if (this.map) { this.loadPositionOnMap(); };
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
    this.map.panTo(new L.LatLng(this.userLat, this.userLng));
    this.posMarker = L.marker([this.userLat, this.userLng], {icon: this.posIcon}).on('click', () => {
      alert('user: lat:'+ this.userLat +", lon:"+ this.userLng);
    });
    this.posMarker.addTo(this.map);
    this.findNearestSenseBoxes();
  }

  // Watch the user position
  subscription = this.geolocation.watchPosition()
    .subscribe(position => {
      this.userLat = position.coords.latitude;
      this.userLng = position.coords.longitude;
      this.loadPositionOnMap();
      this.findNearestSenseBoxes();
    });

  // Search the nearest senseBoxes
  findNearestSenseBoxes(){
    let myLocation : Location = {
      longitude : this.userLng,
      latitude : this.userLat
    };

    this.api.getClosestSenseBoxes(myLocation).subscribe(res => {
      this.closestBoxes = res;
      if(this.senseBoxesSet){
        this.deleteNearestSenseboxes();
      } else {
        this.addNearestSenseboxes();
      }
    });
  }

  // Delete existing senseBoxes
  deleteNearestSenseboxes(){
    for(let i = 0; i < this.closestBoxesMarkers.length; i++){
      this.map.removeLayer(this.closestBoxesMarkers[i]);
      if(i >= this.closestBoxesMarkers.length - 1){
        this.closestBoxesMarkers = [];
        this.addNearestSenseboxes();
      }
    }
  }

  // Add senseBoxes to Map
  addNearestSenseboxes(){
    this.senseBoxesSet = true;
    for(let i = 0; i < this.closestBoxes.length; i++){
      let marker = L.marker([this.closestBoxes[i].coordinates.latitude, this.closestBoxes[i].coordinates.longitude], {icon: this.greenIcon}).on('click', () => {
        alert('senseBox: lat:'+ this.userLat +", lon:"+ this.userLng);
      });
      this.closestBoxesMarkers.push(marker);
      this.closestBoxesMarkers[i].addTo(this.map);
      if(i >= this.closestBoxes.length - 1){
        this.nearestSensebox();
      }
    }
  }

  // Find the nearest senseBox
  nearestSensebox(){
    let nearestBox;
    let nearestDistance;
    for(let i = 0; i < this.closestBoxes.length; i++){
      let userLocation: Location = {
        latitude: this.userLat,
        longitude: this.userLng
      };
      let boxLocation: Location = {
        latitude: this.closestBoxes[i].coordinates.latitude,
        longitude: this.closestBoxes[i].coordinates.longitude
      }
      let distance = this.api.calculateDistance(userLocation, boxLocation);
      if(nearestDistance == undefined || distance < nearestDistance){
        nearestBox = i;
        nearestDistance = distance;
      }
      if(i >= this.closestBoxes.length - 1){
        console.log(nearestDistance + "   " + nearestBox);
        this.connectToBox(nearestBox, this.closestBoxes[nearestBox].coordinates.latitude, this.closestBoxes[nearestBox].coordinates.longitude);
      }
    }
  }

  // Mark the nearest box on the map
  connectToBox(index, lat, lng){
    this.map.removeLayer(this.closestBoxesMarkers[index]);

    this.closestBoxesMarkers[index] = L.marker([lat, lng], {icon: this.redIcon}).on('click', () => {
      alert('senseBox: lat:'+ this.userLat +", lon:"+ this.userLng);
    });
    this.closestBoxesMarkers[index].addTo(this.map);
  }
}
