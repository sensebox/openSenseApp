import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { tileLayer } from "leaflet";
import * as L from "leaflet";
import { Metadata, SenseBox } from "../../../providers/model";
import { OnChanges } from '@angular/core';
import "leaflet.awesome-markers";
import { SensifyPage } from '../../../pages/sensify/sensify-page';

@Component({
    selector: 'sensify-page-map',
    templateUrl: 'sensify-map.html',
})
export class SensifyMapPage implements OnChanges {

    @Input()
    public metadata: Metadata;

    @Output()
    public onMessageChange: EventEmitter<string> = new EventEmitter();

    @Output()
    public onMetadataChange: EventEmitter<Metadata> = new EventEmitter();

    public map: L.Map;
    public layersControl: L.Control.Layers = L.control.layers(null, {}, { position: 'topleft' });
    public radiusCircle: L.CircleMarker;
    public locatorButton: L.Control;
    public LegendButton: L.Control;
    public userLocationMarker: L.Marker;
    public userLocationMarkerLayer: L.LayerGroup;
    public senseboxMarkersLayerGreen: L.LayerGroup;
    public senseboxMarkersLayerYellow: L.LayerGroup;
    public senseboxMarkersLayerRed: L.LayerGroup;
    public senseboxMarkersLayerBlue: L.LayerGroup;
    public distanceToClosestString: String;

    public locateButton = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: (map) => {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.className = 'buttons';
            container.style.backgroundImage = 'url(../../assets/imgs/positionMarker.png)';

            container.onclick = () => {
                if (this.metadata.settings.location) {
                    this.map.panTo(this.metadata.settings.location);
                }
            };
            return container;
        }
    });

    public legendButton = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: (map) => {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.className = 'buttons';
            container.style.backgroundImage = 'url(../../assets/icons/questionmarkicon.png)';

            container.onclick = () => {
                let containerContent = "<ion-grid><ion-row><ion-col col-20><p><img src='../../assets/icons/greenmarkericon.png'></ion-col><ion-col col-80>Data is valid & up-to-date (<24h)</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/icons/notvalidmarkericon.png'></ion-col><ion-col col-80>Data is NOT valid, but up-to-date (<24h)</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/icons/orangemarkericon.png'></ion-col><ion-col col-80>Data is one week old</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/icons/redmarkericon.png'></ion-col><ion-col col-80>Data is older than one week</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/icons/bluemarkericon.png'></ion-col><ion-col col-80>Closest Sensebox</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/icons/positionmarkericon.png'></ion-col><ion-col col-80>User-Location</p></ion-col></ion-row></ion-grid>";
                this.showAlert('Legend', containerContent);
            };
            return container;
        }
    });

    public LeafletOptions = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ],
        zoom: 13,
        center: [0, 0]
    };

    constructor(
        public navCtrl: NavController,
        private elementRef: ElementRef,
        private alertCtrl: AlertController,
        public mySensifyPage: SensifyPage
    ) { }

    public posIcon = L.icon({
        iconUrl: '../../assets/imgs/positionMarker.png',
        iconSize: [50, 50],
        iconAnchor: [25, 48],
        popupAnchor: [-3, -76]
    });

    public customOptionsRed = {
        'className': 'customRed'
    };

    public customOptionsGreen = {
        'className': 'customGreen'
    };

    public customOptionsYellow = {
        'className': 'customYellow'
    };

    ionViewDidLoad() {
        console.log('ionViewDidLoad MapPage');
    }

    ngOnChanges(changes): void {
        if (changes.metadata && this.map) {
            this.updateMap();
        }
    }

    showAlert(legend: string, content: string) {
        let alert = this.alertCtrl.create({
            title: legend,
            subTitle: content,
            cssClass: 'alert',
            buttons: ['Ok']
        });
        alert.present();
    }

    onMapReady(map: L.Map) {
        this.map = map;
        // add custom controls to map
        this.layersControl.addTo(this.map);
        this.map.zoomControl.setPosition('topleft');
        this.map.on('moveend', e => {
            this.metadata.settings.zoomLevel = e.target.getZoom();
            let tempView = e.target.getCenter();
            this.metadata.settings.mapView = new L.LatLng(tempView.lat, tempView.lng);
            this.onMetadataChange.emit(this.metadata);
        });

        this.locatorButton = new this.locateButton();
        this.map.addControl(this.locatorButton);
        this.LegendButton = new this.legendButton();
        this.map.addControl(this.LegendButton);
        this.updateMap();
    }

    public updateMap() {
        if (this.metadata.settings.location) {
            this.addUserLocationToLayer();
            this.addSenseboxMarkerToMap();
        }
    }

    public addUserLocationToLayer() {
        // On first start, set view on user location; otherwise, set view on the saved position/zoom
        if (this.metadata.settings.zoomLevel && this.metadata.settings.mapView) {
            this.map.setView(this.metadata.settings.mapView, this.metadata.settings.zoomLevel);
        } else {
            this.map.setView(this.metadata.settings.location, this.metadata.settings.zoomLevel);
        }

        // Remove user location layer from map
        if (this.userLocationMarkerLayer) {
            this.map.removeLayer(this.userLocationMarkerLayer);
            this.layersControl.removeLayer(this.userLocationMarker);
            this.addUserOverlay();
            this.userLocationMarkerLayer = undefined;
        }

        // Create marker with user location + description
        let popupDescription = "<b>Your position is:</b><br>Latitude: " + this.metadata.settings.location.toString();
        this.userLocationMarker = L.marker(this.metadata.settings.location,
            { icon: this.posIcon })
            .bindPopup(popupDescription);

        // Add Layergroup to userLocationMarkerLayer
        this.userLocationMarkerLayer = L.layerGroup([this.userLocationMarker]).addTo(this.map);
    }

    // Add senseBoxes to Map
    public addSenseboxMarkerToMap() {
        if (this.metadata.senseBoxes && this.metadata.closestSenseBox && this.metadata.senseBoxes.length > 0) {
            let closestMarkersRed: L.Marker[] = [];
            let closestMarkersYellow: L.Marker[] = [];
            let closestMarkersGreen: L.Marker[] = [];
            let closestMarkersBlue: L.Marker[] = [];
            for (let i = 0; i < this.metadata.senseBoxes.length; i++) {
                let marker: L.Marker;
                // Generate marker Popup-Content
                let popupDescription = this.getSenseboxPopupDescription(this.metadata.senseBoxes[i]);
                if(this.metadata.senseBoxes[i] && this.metadata.closestSenseBox){
                    if (this.metadata.senseBoxes[i]._id != this.metadata.closestSenseBox._id && this.metadata.senseBoxes[i]) {
                        let loc = this.metadata.senseBoxes[i].location;
                        switch (this.metadata.senseBoxes[i].updatedCategory) {
                            case 'today': {
                                if (this.metadata.senseBoxes[i].isValid) {
                                    marker = this.createMarker('green', loc)
                                        .bindPopup(popupDescription, this.customOptionsGreen);
                                    closestMarkersGreen.push(marker);
                                } else {
                                    marker = this.createMarker('purple', loc)
                                        .bindPopup(popupDescription, this.customOptionsRed);
                                    closestMarkersGreen.push(marker);
                                }
                                break;
                            }
                            case 'thisWeek': {
                                let marker = this.createMarker('orange', loc)
                                    .bindPopup(popupDescription, this.customOptionsYellow);
                                closestMarkersYellow.push(marker);
                                break;
                            }
                            case 'tooOld': {
                                let marker = this.createMarker('red', loc)
                                    .bindPopup(popupDescription, this.customOptionsRed);
                                closestMarkersRed.push(marker);
                                break;
                            }
                            default: {
                                this.showAlert('Error', 'Ups, something went wrong here.')
                                break;
                            }
                        }
                    } else {
                        marker = this.createMarker('blue', this.metadata.closestSenseBox.location)
                            .bindPopup(popupDescription);
                        closestMarkersBlue.push(marker);
                        // Calculate and style distance distance to ClosestSenseBox
                        let distanceToBox = this.metadata.settings.location.distanceTo(this.metadata.closestSenseBox.location);
                        if (distanceToBox > 999) {
                            distanceToBox = distanceToBox / 1000;
                            this.distanceToClosestString = this.round(distanceToBox, 2) + " km";
                        } else {
                            this.distanceToClosestString = this.round(distanceToBox, 2) + " m";
                        }
                    }
                }
                if (marker) {
                    marker.on('popupopen', () => {
                        this.elementRef.nativeElement.querySelector("#a" + this.metadata.senseBoxes[i]._id).addEventListener('click', (e) => {
                            this.metadata.closestSenseBox = this.metadata.senseBoxes[i];
                            this.metadata.settings.mySenseBox = this.metadata.senseBoxes[i]._id;
                            this.updateMap();
                            this.showAlert('Success', 'New home SenseBox was set');
                        })
                    })
                }
            } // End Create Markers

            // Check if markers were already set; If yes: Delete + Update Markers
            this.updateLayer(this.senseboxMarkersLayerGreen);
            this.updateLayer(this.senseboxMarkersLayerYellow);
            this.updateLayer(this.senseboxMarkersLayerRed);
            this.updateLayer(this.senseboxMarkersLayerBlue);

            //line from user to closest box
            this.connectUserWithBox();

            //Circle, visualizing radius
            this.drawRadiusCircle();

            // Create layerGroups and add layerGroups to map
            this.createLayerGroupsForMarkers(closestMarkersGreen, this.senseboxMarkersLayerGreen, 'Green SenseBoxes');
            this.createLayerGroupsForMarkers(closestMarkersYellow, this.senseboxMarkersLayerYellow, 'Yellow SenseBoxes');
            this.createLayerGroupsForMarkers(closestMarkersRed, this.senseboxMarkersLayerRed, 'Red SenseBoxes');
            this.createLayerGroupsForMarkers(closestMarkersBlue, this.senseboxMarkersLayerBlue, 'Nearest/My SenseBoxes');
  
        } else {
            this.removeLayerGroups(this.senseboxMarkersLayerGreen);
            this.removeLayerGroups(this.senseboxMarkersLayerYellow);
            this.removeLayerGroups(this.senseboxMarkersLayerRed);
            this.removeLayerGroups(this.senseboxMarkersLayerBlue);

            if (this.senseboxMarkersLayerGreen === undefined && 
                this.senseboxMarkersLayerYellow === undefined && 
                this.senseboxMarkersLayerRed === undefined && 
                this.senseboxMarkersLayerBlue === undefined || 
                this.metadata.closestSenseBox === null || 
                this.metadata.closestSenseBox === undefined) {
                    this.showAlert('Error','No SenseBoxes were found.');
            }
        }
    }

    private createMarker(color: any, loc: L.LatLng): L.Marker {
        let marker = new L.Marker(loc,
            {
                icon: L.AwesomeMarkers.icon({
                    markerColor: color
                })
            });
        return marker;
    }

    private updateLayer(layer: L.LayerGroup) {
        if (layer) {
            this.map.removeLayer(layer);
            this.layersControl.removeLayer(layer);
            layer = undefined;
        }
    }

    private connectUserWithBox() {
        let lineCoords = [[this.metadata.settings.location, this.metadata.closestSenseBox.location]];
        let line = L.polyline(lineCoords, {
            className: "line",
            dashArray: "10,15"
        });
        this.userLocationMarkerLayer.addLayer(line);
        this.layersControl.addOverlay(this.userLocationMarkerLayer, 'Me');
    }

    private drawRadiusCircle() {
        if (this.radiusCircle) {
            this.map.removeLayer(this.radiusCircle);
        }
        this.radiusCircle = L.circle(this.metadata.settings.location, {
            className: "circle",
            radius: this.metadata.settings.radius * 1000
        }).addTo(this.map);
    }

    private createLayerGroupsForMarkers(markerArray: L.Marker[], layer: L.LayerGroup, description: string) {
        if (markerArray.length > 0) {
            layer = new L.LayerGroup(markerArray).addTo(this.map);
            this.layersControl.addOverlay(layer, description);
        }
    }

    private removeLayerGroups(layer: L.LayerGroup) {
        if (layer !== undefined) {
            this.map.removeLayer(layer);
            this.layersControl.removeLayer(layer);
        }
    }

    private addUserOverlay() {
        this.map.removeControl(this.layersControl);
        this.layersControl = L.control.layers(null, {}, { position: 'topleft' });
        this.layersControl.addTo(this.map);

        this.map.zoomControl.setPosition('topleft');
        this.locatorButton.setPosition('topleft');
        this.LegendButton.setPosition('topleft');
    }

    private getSenseboxPopupDescription(sensebox: SenseBox): string {
        if(sensebox){
            let sensorTitle = "<b>" + sensebox.name + "</b>";
            let sensorsDescription: String = "";
            let id = 'a' + sensebox._id;
            let makeThisMySenseBox = "<button id='" + id + "'>Make this my home SenseBox</button>";
            for (let i = 0; i < sensebox.sensors.length; i++) {
                if (sensebox.sensors[i].lastMeasurement != null && sensebox.sensors[i].lastMeasurement) {
                    sensorsDescription += sensebox.sensors[i].title + ": " + sensebox.sensors[i].lastMeasurement.value + "<br>";
                }
            }
            return sensorTitle + "<br>" + sensorsDescription + makeThisMySenseBox;
        }
    }

    private round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}
