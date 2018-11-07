import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { tileLayer } from "leaflet";
import { GeolocationOptions, Geoposition } from "@ionic-native/geolocation";
import * as L from "leaflet";
import { Metadata, SenseBox } from "../../../providers/model";
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
    public closestBoxes: any;
    public closestBoxesMarkers: any[] = [];
    public senseBoxesSet: boolean = false;

    // Leaflet Config Values
    public map: L.Map;
    public LeafletOptions = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ],
        zoom: 13,
        center: [0, 0]
    };
    public layersControl = {
        baselayers: null,
        overlays: {},
        options: {
            position: 'bottomleft'
        }
    };
    public userLocationMarker: L.Marker;
    public userLocationMarkerLayer: L.LayerGroup;    
    public senseboxMarkersLayer: L.LayerGroup;

    public controllJSON;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public LM: LeafletModule,
        public sensifyPage : SensifyPage) {}

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
            if (this.metadata.settings.location) {
                this.addUserLocationToMap();
            }
            if (this.metadata.senseBoxes) {
                this.removeMarkers();
                this.addSenseboxMarkerToMap();
            }
        }
    }

    onMapReady(map: L.Map) {
        this.map = map;
        // this.map.removeControl();
        // this.map.addControl(L.control.zoom({ position: 'topleft' }));
        this.addUserLocationToMap();
        if (this.metadata && this.metadata.senseBoxes) {
            this.addSenseboxMarkerToMap();
        }
    }

    public addUserLocationToMap() {
        // Center map on user location
        this.map.panTo(this.metadata.settings.location);

        // Remove user location layer from map
        if (this.userLocationMarkerLayer != undefined) {
            this.map.removeLayer(this.userLocationMarkerLayer);
        }

        // Create marker with user location + description
        let popupDescription = "<b>Your position is:</b><br>Latitude: " + this.metadata.settings.location.toString();
        this.userLocationMarker = L.marker(this.metadata.settings.location, 
            { icon: this.posIcon })
            .bindPopup(popupDescription);
        
        // Add userLocationMarker to Overlay Layer "Me"
        this.layersControl.overlays['Me'] = L.layerGroup([this.userLocationMarker]);
        this.layersControl.overlays['Me'].addTo(this.map);
    }
 
    // TODO: write delete function or better UPDATE function
    // Delete existing senseBoxes
    public deleteclosestSenseboxes() {
        for (let i = 0; i < this.closestBoxesMarkers.length; i++) {
            this.map.removeLayer(this.closestBoxesMarkers[i]);
            if (i >= this.closestBoxesMarkers.length - 1) {
                this.closestBoxesMarkers = [];
            }
        }
    }
 
    // Add senseBoxes to Map
    public addSenseboxMarkerToMap() {
        // this.senseBoxesSet = true;
        for (let i = 0; i < this.metadata.senseBoxes.length; i++) {
            // Generate marker-description
            let popupDescription = this.getSenseboxPopupDescription(this.metadata.senseBoxes[i]);
            // Generate marker
            if(this.metadata.senseBoxes[i].location != this.metadata.closestSenseBox.location){
                let marker = L.marker(this.metadata.senseBoxes[i].location, 
                    { icon: this.greenIcon })
                    .bindPopup(popupDescription);
                // Add marker to map
                this.closestBoxesMarkers.push(marker);
            }else{//ClosestSenseBox Marker
                let marker = L.marker(this.metadata.senseBoxes[i].location, 
                    { icon: this.redIcon })
                    .bindPopup(popupDescription);
                // Add marker to map
                this.closestBoxesMarkers.push(marker);
            }
        }
        //line from user to closest box
        let lineCoords = [[this.metadata.settings.location, this.metadata.closestSenseBox.location]]
        let polyline = L.polyline(lineCoords, {color:'red'})
        this.closestBoxesMarkers.push(polyline);
        this.senseboxMarkersLayer = L.layerGroup(this.closestBoxesMarkers);
        this.layersControl.overlays['SenseBoxes'] = this.senseboxMarkersLayer;
        this.layersControl.overlays['SenseBoxes'].addTo(this.map);
    }

    public getSenseboxPopupDescription(sensebox: SenseBox): string{
        let sensorTitle = "<b>" + sensebox.name + "</b>";
        let sensorsDescription : any;
        for (let i = 0; i < sensebox.sensors.length; i++) {
            if (sensebox.sensors[i].lastMeasurement != null && sensebox.sensors[i].lastMeasurement) {
                sensorsDescription += sensebox.sensors[i].title + ": " + sensebox.sensors[i].lastMeasurement.value + "<br>";
            }
        }
        return sensorTitle + "<br>" + sensorsDescription;
    }

    public removeMarkers(){
  
    }

    // Mark the nearest box on the map

        // TODO: connect box and user on map = draw line
    /*
        console.log(this.map);
        
        this.map.removeLayer(this.closestBoxesMarkers[index]);

        this.closestBoxesMarkers[index] = L.marker([lat, lng], { icon: this.redIcon }).on('click', () => {
            alert('senseBox: lat:' + this.metadata.settings.location.latitude + ", lon:" + this.metadata.settings.location.longitude);
        });
        this.closestBoxesMarkers[index].addTo(this.map);
    */
    
}
