import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import leaflet from 'leaflet';
import 'leaflet-search';
import 'leaflet.locatecontrol';
import $ from "jquery";

/**
 * Generated class for the LeafletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaflet',
  templateUrl: 'leaflet.html',
})
export class LeafletPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  boxData: any;
  boxLayer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad LeafletPage');
  }

  loadMap() {
    //initiate map
    this.map = leaflet.map('map', {zoomControl: false}).setView([51.9606649, 7.6261347], 13);

    //add tile layer to map
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    //add location finder
    var lc = leaflet.control.locate({
      position: 'topleft',
      strings: {
        setView: "once"
      }
    }).addTo(this.map);

    //load sensboxes
    // this.loadSenseboxLayer();

    //add search
    this.map.addControl(new leaflet.Control.Search({
      url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat', 'lon'],
      marker: leaflet.marker([0, 0]),
      autoCollapse: true,
      autoType: false,
      minLength: 2
    }));

    //define custom sensebox icon for marker
    let senseIcon = leaflet.icon({
      iconUrl: 'assets/imgs/logo.png',
      iconSize: [50, 50], // size of the icon
    });

    // create marker object, pass custom icon as option, add to map
    let marker = leaflet.marker([51.9606649, 7.6261347], {icon: senseIcon}).addTo(this.map);
    this.loadSenseboxLayer();
  }

  safeBoxId() {
    debugger;
    this.storage.set('boxID', 'Max');
  };

  loadSenseboxLayer() {
    let senseBoxIcon = new leaflet.Icon({
      iconSize: [40, 40],
      iconAnchor: [13, 27],
      popupAnchor:  [1, -24],
      iconUrl: '../assets/imgs/marker.png'
    });
    $.getJSON('https://api.opensensemap.org/boxes?exposure=outdoor', data => {
      let jsonData = JSON.stringify(data);
      jsonData = JSON.parse(jsonData);
      console.log(jsonData);
      this.boxData = jsonData;
      this.boxLayer = leaflet.geoJSON('', {
        id: 'jsonLayer',
        pointToLayer: function (feature, latlng) {
          return leaflet.marker(latlng, {icon: senseBoxIcon});
        }

      }).addTo(this.map);
      this.boxData.forEach((entry) => {
        let geojsonFeature = _createGeojsonFeaturen(entry);
        this.boxLayer.addData(geojsonFeature)
      });
      this.boxLayer.bindPopup(function (layer) {
        return leaflet.Util.template('<p><b>Box Name : </b>{name}<br><b><button data-id={id} id="boxButton" onclick="this.safeBoxId()">set preference</button><br></p>', layer.feature.properties);
      }, this);
    });

  }

}



let
  _createGeojsonFeaturen = (entry) => {


    let geojsonFeature = {
      "type": "Feature",
      "properties": {
        "name": entry.name,
        "id": entry._id,
        "entry": entry,
        "popupContent": 'GoodBox!'

      },
      "geometry": {
        "type": "Point",
        "coordinates": [parseFloat(entry.currentLocation.coordinates[0]), parseFloat(entry.currentLocation.coordinates[1])]
      }
    };
    return geojsonFeature;
  };
