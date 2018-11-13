import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import leaflet from 'leaflet';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad LeafletPage');
  }

  loadMap() {
    this.map = leaflet.map('map').setView([51.505, -0.09], 13);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    leaflet.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    this.loadSenseboxLayer();
  }

  loadSenseboxLayer() {
    let featureArray = [];
    $.getJSON('https://api.opensensemap.org/boxes?exposure=outdoor', data => {
      let jsonData = JSON.stringify(data);
      jsonData = JSON.parse(jsonData);
      console.log(jsonData);
      this.boxData = jsonData;
      this.boxLayer = leaflet.geoJSON('', {
        id: 'jsonLayer',

      }).addTo(this.map);


      this.boxData.forEach((entry) => {
        let geojsonFeature = _createGeojsonFeaturen(entry);
        this.boxLayer.addData(geojsonFeature)
      });
      this.boxData.forEach(box => {
        featureArray.push(box);
      });
    });

  }
}

let
  getJsonData = () => {
    $.getJSON('https://api.opensensemap.org/boxes?', data => {
      let jsonData = JSON.stringify(data);
      jsonData = JSON.parse(jsonData);
      return jsonData;
    })
  };
let
  _createGeojsonFeaturen = (entry) => {
    let geojsonFeature = {
      "type": "Feature",
      "properties": {
        "name": entry.Name,
        "amenity": entry.Name,
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
