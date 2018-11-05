import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer } from "leaflet";
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";
import { ApiProvider } from '../../../providers/api/api';
import { Location } from "../../../providers/model";


@Component({
    selector: 'sensify-page-map',
    templateUrl: 'sensify-map.html',
})
export class SensifyMapPage {

    options: GeolocationOptions;
    currentPos: Geoposition;
    public posMarker;
    public userLng: number;
    public userLat: number;
    public closestBoxes: any;
    public closestBoxesMarkers: any[] = [];
    public senseBoxesSet: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public LM: LeafletModule, private geolocation: Geolocation, private api: ApiProvider) { }

    public greenIcon = L.icon({
        iconUrl: '../../assets/imgs/greenMarker.png',

        iconSize: [25, 40],
        iconAnchor: [12, 40],
        popupAnchor: [-3, -76]
    });

    public redIcon = L.icon({
        iconUrl: '../../assets/imgs/redMarker.png',

        iconSize: [40, 40],
        iconAnchor: [20, 37],
        popupAnchor: [-3, -76]
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
    getUserPosition() {
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
    onMapReady(map: L.Map) {
        this.map = map;
    }

    // Center the map on the user-position
    loadPositionOnMap() {
        if (this.posMarker != undefined) {
            this.map.removeLayer(this.posMarker);
        }
        this.map.panTo(new L.LatLng(this.userLat, this.userLng));
        this.posMarker = L.marker([this.userLat, this.userLng], { icon: this.posIcon })
            .bindPopup("<b>Your position:</b> <br> Latitude: " + this.userLat + " <br> Longitude: " + this.userLng);
        this.posMarker.addTo(this.map);
        this.findclosestSenseboxes();
    }

    // Watch the user position
    subscription = this.geolocation.watchPosition()
        .subscribe(position => {
            this.userLat = position.coords.latitude;
            this.userLng = position.coords.longitude;
            this.loadPositionOnMap();
            this.findclosestSenseboxes();
        });

    // Search the nearest senseBoxes
    findclosestSenseboxes() {
        let myLocation: Location = {
            longitude: this.userLng,
            latitude: this.userLat
        };

        this.api.getClosestSenseBoxes(myLocation).subscribe(res => {
            this.closestBoxes = res;
            if (this.senseBoxesSet) {
                this.deleteclosestSenseboxes();
            } else {
                this.addClosestSenseboxes();
            }
        });
    }

    // Delete existing senseBoxes
    deleteclosestSenseboxes() {
        for (let i = 0; i < this.closestBoxesMarkers.length; i++) {
            this.map.removeLayer(this.closestBoxesMarkers[i]);
            if (i >= this.closestBoxesMarkers.length - 1) {
                this.closestBoxesMarkers = [];
                this.addClosestSenseboxes();
            }
        }
    }

    // Add senseBoxes to Map
    addClosestSenseboxes() {
        this.senseBoxesSet = true;
        for (let i = 0; i < this.closestBoxes.length; i++) {
            // Generate popup-description
            let popupTextSensors = "";
            for (let s = 0; s < this.closestBoxes[i].sensors.length; s++) {
                if (this.closestBoxes[i].sensors[s].lastMeasurement != null) {
                    popupTextSensors += this.closestBoxes[i].sensors[s].title + ": " + this.closestBoxes[i].sensors[s].lastMeasurement.value + "<br>";
                }
            }
            // Generate Popup with description
            let marker = L.marker([this.closestBoxes[i].coordinates.latitude, this.closestBoxes[i].coordinates.longitude], { icon: this.greenIcon })
                .bindPopup("<b>" + this.closestBoxes[i].name + "</b><br>" + popupTextSensors);
            this.closestBoxesMarkers.push(marker);
            this.closestBoxesMarkers[i].addTo(this.map);
            if (i >= this.closestBoxes.length - 1) {
                this.closestSensebox();
            }
        }
    }

    // Find the nearest senseBox
    closestSensebox() {
        let userLocation: Location = {
            latitude: this.userLat,
            longitude: this.userLng
        };
        let closestBox: any = this.api.getclosestSenseBox(this.closestBoxes, userLocation);
        this.connectToBox(closestBox.index, closestBox.box.coordinates.latitude, closestBox.box.coordinates.longitude)

        //Test for Validation!!! Can be called from anywhere via API
        this.api.validateSenseBoxTemperature(closestBox.box, this.closestBoxes)
    }

    // Mark the nearest box on the map
    connectToBox(index, lat, lng) {
        this.map.removeLayer(this.closestBoxesMarkers[index]);

        this.closestBoxesMarkers[index] = L.marker([lat, lng], { icon: this.redIcon }).on('click', () => {
            alert('senseBox: lat:' + this.userLat + ", lon:" + this.userLng);
        });
        this.closestBoxesMarkers[index].addTo(this.map);
    }
}
