import { Component, Input, SimpleChange } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer } from "leaflet";
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";
import { ApiProvider } from '../../../providers/api/api';
import { Location, Settings } from "../../../providers/model";
import { SensifyPage } from "../../../pages/sensify/sensify-page";
import {OnChanges} from '@angular/core';

@Component({
    selector: 'sensify-page-map',
    templateUrl: 'sensify-map.html',
})
export class SensifyMapPage implements OnChanges {

    @Input()
    public settings: Settings;
    public options: GeolocationOptions;
    public currentPos: Geoposition;
    public posMarker;
    public closestBoxes: any;
    public closestBoxesMarkers: any[] = [];
    public senseBoxesSet: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public LM: LeafletModule,
        private api: ApiProvider,
        public sensifyPage : SensifyPage) { }

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
    }

    ngOnChanges(changes): void {
        if (changes.settings && this.map) {
            this.addUserLocationToMap();
        }
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
        this.addUserLocationToMap();
    }

    // Center the map on the user-position
    addUserLocationToMap() {
        if (this.posMarker != undefined) {
            this.map.removeLayer(this.posMarker);
        }
        // TODO: check Leaflet Documentation for LatLng object --> maybe adapt
        this.map.panTo(new L.LatLng(this.settings.location.latitude, this.settings.location.longitude));
        this.posMarker = L.marker([this.settings.location.latitude, this.settings.location.longitude], { icon: this.posIcon })
            .bindPopup("<b>Your position:</b> <br> Latitude: " + this.settings.location.latitude + " <br> Longitude: " + this.settings.location.longitude);
        this.posMarker.addTo(this.map);
        this.findclosestSenseboxes();
    }

    
    // Search the nearest senseBoxes
    findclosestSenseboxes() {
        this.api.getClosestSenseBoxes(this.settings.location).subscribe(res => {
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
        let closestBox: any = this.api.getclosestSenseBox(this.closestBoxes, this.settings.location);
        this.connectToBox(closestBox.index, closestBox.box.coordinates.latitude, closestBox.box.coordinates.longitude)

        //Test for Validation!!! Can be called from anywhere via API
        this.api.validateSenseBoxTemperature(closestBox.box, this.closestBoxes)
    }

    // Mark the nearest box on the map
    connectToBox(index, lat, lng) {
        this.map.removeLayer(this.closestBoxesMarkers[index]);

        this.closestBoxesMarkers[index] = L.marker([lat, lng], { icon: this.redIcon }).on('click', () => {
            alert('senseBox: lat:' + this.settings.location.latitude + ", lon:" + this.settings.location.longitude);
        });
        this.closestBoxesMarkers[index].addTo(this.map);
    }
}
