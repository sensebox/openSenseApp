import {Component, ViewChild, ElementRef, } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import leaflet from 'leaflet';
import 'leaflet-search';
import 'leaflet.locatecontrol';

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
  @ViewChild('map')
  mapContainer: ElementRef;
  map: any;
  boxData: any;
  boxLayer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private elementRef: ElementRef, public viewCtr: ViewController, private api: ApiProvider) {
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
    let lc = leaflet.control.locate({
      position: 'topleft',
      strings: {
        setView: "once"
      }
    }).addTo(this.map);

    // add event for location found of location finder
    function onLocationFound(e) {
      console.log("You were located!")
    }
    // add event listener to map
    this.map.on('locationfound', this.getClosestSensebox, this);

    //add search and event function
    this.map.addControl(new leaflet.Control.Search({
      url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat', 'lon'],
      marker: leaflet.marker([0, 0]),
      autoCollapse: true,
      autoType: false,
      minLength: 2
    }).on('search:locationfound', e =>{
      console.log("Location Found");
      this.getClosestSensebox(e)
    }, this));

    this.loadSenseboxLayer();
  }


  getClosestSensebox(e) {
    let minDist = 100;
    let closestSenseboxID;
    this.boxData.forEach((box) => {
      let dist = this.distance(e.latlng, [parseFloat(box.currentLocation.coordinates[0]), parseFloat(box.currentLocation.coordinates[1])])
      if (minDist > dist) {
        minDist = dist;
        closestSenseboxID = box._id;
      }
    });
    console.log(closestSenseboxID);
    for (let box in this.boxLayer._layers) {
      if (this.boxLayer._layers[box].feature.properties.id === closestSenseboxID) {
        let selectedSenseBoxIcon = new leaflet.Icon({
          iconSize: [40, 40],
          iconAnchor: [13, 27],
          popupAnchor: [1, -24],
          iconUrl: '../assets/imgs/markerYellow.png'
        });
        this.boxLayer._layers[box].feature.properties.icon = selectedSenseBoxIcon;

      }
    }
  };

  distance(latlng1, latlng2) {
    let distance;
    if (latlng1.lat == latlng2[0] && latlng1.lng == latlng2[1]) {
      distance = 0
    } else {
      distance = Math.sqrt((Math.pow((latlng1.lat - latlng2[1]), 2) + Math.pow((latlng1.lng - latlng2[0]), 2)));
    }
    return distance;
  };
  safeBoxId(e) {
    let id = e.target.id.substring(2);
    this.api.setBoxId(id);
    //closes popover after preference is selected
    this.viewCtr.dismiss();
  };

  loadSenseboxLayer() {
    let senseBoxIcon = new leaflet.Icon({
      iconSize: [40, 40],
      iconAnchor: [13, 27],
      popupAnchor: [1, -24],
      iconUrl: '../assets/imgs/markerGreen.png'
    });
    this.api.getData().subscribe(data => {
      let jsonData = JSON.stringify(data);
      this.boxData = JSON.parse(jsonData);
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
        return leaflet.Util.template('<p><b>Box Name : </b>{name}<br><b><button id="id{id}" name="pref" data-id={id} value="prf">Set as preference</button><br><br></p>', layer.feature.properties);
      });

      this.boxLayer.on('popupopen', (e) => {
        this.elementRef.nativeElement.querySelector('#id' + e.popup._source.feature.properties.id)
          .addEventListener('click', this.safeBoxId.bind(this));

      })
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
