import { Component, Input, Output, ElementRef } from '@angular/core';
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
            container.className = 'button';
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
            container.className = 'button';
            container.style.backgroundImage = 'url(../../assets/imgs/question-mark.png)';

            container.onclick = () => {
                let containerContent = "<ion-grid><ion-row><ion-col col-20><p><img src='../../assets/imgs/greenmarkericon.png'></ion-col><ion-col col-80>Data is valid & up-to-date (<24h)</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/imgs/notvalidmarkericon.png'></ion-col><ion-col col-80>Data is NOT valid, but up-to-date (<24h)</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/imgs/orangemarkericon.png'></ion-col><ion-col col-80>Data is one week old</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/imgs/redmarkericon.png'></ion-col><ion-col col-80>Data is older than one week</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/imgs/bluemarkericon.png'></ion-col><ion-col col-80>Closest Sensebox</p></ion-col></ion-row><ion-row><ion-col col-20><p><img style='height:40px' src='../../assets/imgs/positionmarkericon.png'></ion-col><ion-col col-80>User-Location</p></ion-col></ion-row></ion-grid>";
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

    public redMarker = L.AwesomeMarkers.icon({
        markerColor: 'red'
    });

    public greenMarker = L.AwesomeMarkers.icon({
        markerColor: "green"
    });

    public orangeMarker = L.AwesomeMarkers.icon({
        markerColor: "orange"
    });

    public blueMarker = L.AwesomeMarkers.icon({
        markerColor: "blue"
    });

    public greenNotValidMarker = L.AwesomeMarkers.icon({
        markerColor: "purple"
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
            let closestMarkersRed = [];
            let closestMarkersYellow = [];
            let closestMarkersGreen = [];
            let closestMarkersBlue = [];
            for (let i = 0; i < this.metadata.senseBoxes.length; i++) {
                if (!this.metadata.senseBoxes[i]) {
                } else {
                    // Generate marker-description
                    let popupDescription = this.getSenseboxPopupDescription(this.metadata.senseBoxes[i]);
                    // Generate marker
                    let marker;
                    if (this.metadata.senseBoxes[i]._id != this.metadata.closestSenseBox._id) {
                        if (this.metadata.senseBoxes[i].updatedCategory == "today" && this.metadata.senseBoxes[i].isValid) {
                            marker = L.marker(this.metadata.senseBoxes[i].location,
                                { icon: this.greenMarker })
                                .bindPopup(popupDescription, this.customOptionsGreen);
                            // Add marker to map
                            closestMarkersGreen.push(marker);
                        } else if (this.metadata.senseBoxes[i].updatedCategory == "today" && !this.metadata.senseBoxes[i].isValid) {
                            marker = L.marker(this.metadata.senseBoxes[i].location,
                                { icon: this.greenNotValidMarker })
                                .bindPopup(popupDescription, this.customOptionsRed);
                            // Add marker to map
                            closestMarkersGreen.push(marker);
                        } else if (this.metadata.senseBoxes[i].updatedCategory == "thisWeek") {
                            marker = L.marker(this.metadata.senseBoxes[i].location,
                                { icon: this.orangeMarker })
                                .bindPopup(popupDescription, this.customOptionsYellow);
                            // Add marker to map
                            closestMarkersYellow.push(marker);
                        } else if (this.metadata.senseBoxes[i].updatedCategory == "tooOld") {
                            marker = L.marker(this.metadata.senseBoxes[i].location,
                                { icon: this.redMarker })
                                .bindPopup(popupDescription, this.customOptionsRed);
                            // Add marker to map
                            closestMarkersRed.push(marker);
                        }
                    } else {//ClosestSenseBox Marker
                        marker = L.marker(this.metadata.closestSenseBox.location,
                            { icon: this.blueMarker })
                            .bindPopup(popupDescription, this.customOptionsGreen);
                        // Add marker to map
                        closestMarkersBlue.push(marker);
                        let tempDistance = this.metadata.settings.location.distanceTo(this.metadata.closestSenseBox.location);
                        if (tempDistance > 999) {
                            tempDistance = tempDistance / 1000;
                            this.distanceToClosestString = this.round(tempDistance, 2) + " km";
                        } else {
                            this.distanceToClosestString = this.round(tempDistance, 2) + " m";
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
                }
            }

            // Check if markers were already set; delete them if yes -> update markers
            if (this.senseboxMarkersLayerGreen != undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerGreen);
                this.layersControl.removeLayer(this.senseboxMarkersLayerGreen);
                this.senseboxMarkersLayerGreen = undefined;
            }
            if (this.senseboxMarkersLayerYellow != undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerYellow);
                this.layersControl.removeLayer(this.senseboxMarkersLayerYellow);
                this.senseboxMarkersLayerYellow = undefined;
            }
            if (this.senseboxMarkersLayerRed != undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerRed);
                this.layersControl.removeLayer(this.senseboxMarkersLayerRed);
                this.senseboxMarkersLayerRed = undefined;
            }
            if (this.senseboxMarkersLayerBlue != undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerBlue);
                this.layersControl.removeLayer(this.senseboxMarkersLayerBlue);
                this.senseboxMarkersLayerBlue = undefined;
            }

            //line from user to closest box
            let lineCoords = [[this.metadata.settings.location, this.metadata.closestSenseBox.location]];
            let line = L.polyline(lineCoords, { className: "line", dashArray: "10,15" });
            this.userLocationMarkerLayer.addLayer(line);
            this.layersControl.addOverlay(this.userLocationMarkerLayer, 'Me');

            //Circle, visualizing radius
            if (this.radiusCircle) {
                this.map.removeLayer(this.radiusCircle);
            }
            this.radiusCircle = L.circle(this.metadata.settings.location, {
                className: "circle",
                radius: this.metadata.settings.radius * 1000
            }).addTo(this.map);

            // Create layerGroups and add layerGroups to map
            if (closestMarkersGreen.length > 0) {
                this.senseboxMarkersLayerGreen = L.layerGroup(closestMarkersGreen).addTo(this.map);
                this.layersControl.addOverlay(this.senseboxMarkersLayerGreen, 'Green SenseBoxes');
            }
            if (closestMarkersYellow.length > 0) {
                this.senseboxMarkersLayerYellow = L.layerGroup(closestMarkersYellow);
                this.layersControl.addOverlay(this.senseboxMarkersLayerYellow, 'Yellow SenseBoxes');
            }
            if (closestMarkersRed.length > 0) {
                this.senseboxMarkersLayerRed = L.layerGroup(closestMarkersRed);
                this.layersControl.addOverlay(this.senseboxMarkersLayerRed, 'Red SenseBoxes');
            }
            if (closestMarkersBlue.length > 0) {
                this.senseboxMarkersLayerBlue = L.layerGroup(closestMarkersBlue).addTo(this.map);
                this.layersControl.addOverlay(this.senseboxMarkersLayerBlue, 'Nearest/My SenseBoxes');
            }
        } else {
            if (this.senseboxMarkersLayerGreen !== undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerGreen);
                this.layersControl.removeLayer(this.senseboxMarkersLayerGreen);
            }
            if (this.senseboxMarkersLayerYellow !== undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerYellow);
                this.layersControl.removeLayer(this.senseboxMarkersLayerYellow);
            }
            if (this.senseboxMarkersLayerRed !== undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerRed);
                this.layersControl.removeLayer(this.senseboxMarkersLayerRed);
            }
            if (this.senseboxMarkersLayerBlue !== undefined) {
                this.map.removeLayer(this.senseboxMarkersLayerBlue);
                this.layersControl.removeLayer(this.senseboxMarkersLayerBlue);
            }
            if (this.senseboxMarkersLayerGreen === undefined && this.senseboxMarkersLayerYellow === undefined && this.senseboxMarkersLayerRed === undefined && this.senseboxMarkersLayerBlue === undefined || this.metadata.closestSenseBox === null || this.metadata.closestSenseBox === undefined) {
                this.mySensifyPage.presentClosableToast('No SenseBoxes around.');
            }
        }
    }

    private addLegendToMap() {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ['blueMarker', 'greenMarker', 'redMarker', 'positionMarker'],
            labels = ['a', 'b', 'c', 'd'];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            let image = '<img src="url(../../assets/imgs/' + grades[i] + '.png" height="30px" width="30px">';
            div.innerHTML += '<p' + image + labels[i] + "</p>";
        }
        return div;
    }

    private addUserOverlay() {
        this.map.removeControl(this.layersControl);
        this.layersControl = L.control.layers(null, {}, { position: 'topleft' });
        this.layersControl.addTo(this.map);

        this.map.zoomControl.setPosition('topleft');
        this.locatorButton.setPosition('topleft');
        this.LegendButton.setPosition('topleft');
    }

    // Create Popop-Description for senseBoxes
    private getSenseboxPopupDescription(sensebox: SenseBox): string {
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

    private round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}
