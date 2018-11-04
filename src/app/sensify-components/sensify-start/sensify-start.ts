import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { latLng, tileLayer} from "leaflet";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from "@ionic-native/geolocation";
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

@Component({
  selector: 'sensify-page-start',
  templateUrl: 'sensify-start.html',
})
export class SensifyStartPage{

  public closestBoxes: any;
  closestBox:any;

  options : GeolocationOptions;
  currentPos : Geoposition;
  
  boxName:String;
  date:String;
  hour:String;
  day:String;
  temperature:String;
  relHumidity:String;
  pressure:String;
  UV:String;
  particulates:String;
  lumen:String;
  
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider,private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder) {

    this.temperature = " - ";
    this.relHumidity = " - ";
    this.pressure = " - ";
    this.UV = " - ";
    this.particulates = " - ";
    this.lumen = " - ";

      platform.ready().then(() => {
        
        this.geolocation.getCurrentPosition(this.options)
          .then((pos: Geoposition) => {
            this.api.getClosestSenseBoxes(pos.coords).subscribe(boxes =>{
              this.closestBox = this.api.getclosestSenseBox(boxes,pos.coords);
              //console.log(this.closestBox);
              this.temperature = this.getInfo("Temperatur", this.closestBox);
              this.relHumidity = this.getInfo("rel. Luftfeuchte", this.closestBox);
              this.pressure = this.getInfo("Luftdruck", this.closestBox);
              this.UV = this.getInfo("UV-Intensität", this.closestBox);
              this.lumen = this.getInfo("Beleuchtungsstärke", this.closestBox);
            }); 
        }).catch(e => {
          console.log(e);
      });
      }).catch(e => {
    });
  }

  collapse(){
    if(document.getElementById("overlay1").style.display == "inline"){
      document.getElementById("img_1").style.height="120px";
      document.getElementById("overlay1").style.display="none";
    }else{
      document.getElementById("img_1").style.height="320px";
      document.getElementById("overlay1").style.display="inline";
    }
  }
  
  getInfo(val:String, box:any){
    for(let i in box.box.sensors){
      if(box.box.sensors[i].title == val){
        if(val == "Temperatur"){
            this.date = box.box.sensors[i].lastMeasurement.createdAt;
            this.hour = this.date.substring(11,16);
            this.day = this.date.substring(0,10);
        }
        this.boxName = box.box.name;
        return box.box.sensors[i].lastMeasurement.value;
      }
    }
    return "no Sensor";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyStartPage');
  }
}
