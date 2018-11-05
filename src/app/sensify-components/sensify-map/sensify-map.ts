import { Component, Input, SimpleChange } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { latLng, tileLayer } from "leaflet";
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from "@ionic-native/geolocation";
import * as L from "leaflet";
import { ApiProvider } from '../../../providers/api/api';
import { Location, Metadata } from "../../../providers/model";
import { SensifyPage } from "../../../pages/sensify/sensify-page";
import {OnChanges} from '@angular/core';

@Component({
    selector: 'sensify-page-map',
    templateUrl: 'sensify-map.html',
})
export class SensifyMapPage implements OnChanges {

    @Input()
    public metadata: Metadata;

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
        if (changes.metadata && this.map) {
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
        this.map.panTo(new L.LatLng(this.metadata.settings.location.latitude, this.metadata.settings.location.longitude));
        this.posMarker = L.marker([this.metadata.settings.location.latitude, this.metadata.settings.location.longitude], { icon: this.posIcon })
            .bindPopup("<b>Your position:</b> <br> Latitude: " + this.metadata.settings.location.latitude + " <br> Longitude: " + this.metadata.settings.location.longitude);
        this.posMarker.addTo(this.map);
        //this.findclosestSenseboxes();
    }

    // TODO: Group Makers into single Layer instead of individual layers
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
        for (let i = 0; i < this.metadata.senseBoxes.length; i++) {
            // Generate popup-description
            let popupTextSensors = "";
            for (let s = 0; s < this.metadata.senseBoxes[i].sensors.length; s++) {
                if (this.metadata.senseBoxes[i].sensors[s].lastMeasurement != null) {
                    popupTextSensors += this.metadata.senseBoxes[i].sensors[s].title + ": " + this.metadata.senseBoxes[i].sensors[s].lastMeasurement.value + "<br>";
                }
            }
            // Generate Popup with description
            let marker = L.marker([this.metadata.senseBoxes[i].coordinates.latitude, this.metadata.senseBoxes[i].coordinates.longitude], { icon: this.greenIcon })
                .bindPopup("<b>" + this.metadata.senseBoxes[i].name + "</b><br>" + popupTextSensors);
            this.closestBoxesMarkers.push(marker);
            this.closestBoxesMarkers[i].addTo(this.map);
        }
        this.connectToBox();
    }


    // Mark the nearest box on the map
    connectToBox() {

        console.log(this.map);/*
        this.map.removeLayer(this.closestBoxesMarkers[index]);

        this.closestBoxesMarkers[index] = L.marker([lat, lng], { icon: this.redIcon }).on('click', () => {
            alert('senseBox: lat:' + this.metadata.settings.location.latitude + ", lon:" + this.metadata.settings.location.longitude);
        });
        this.closestBoxesMarkers[index].addTo(this.map);*/
    }
}
