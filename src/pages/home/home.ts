
import {Component } from '@angular/core';
import { ModalController,NavController, NavParams} from 'ionic-angular';
import {SettingsPage} from '../settings/settings';
import {WeatherProvider} from '../../providers/weather/weather';

import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import {Storage} from '@ionic/storage';



/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-about',
  templateUrl: 'home.html',
  providers:[WeatherProvider]
})
export class HomePage {
  weather: any;
  location:{
    city:string,
    code: string
  }
  constructor(public navCtrl:NavController, public modalCtrl:ModalController, public WeatherProvider: WeatherProvider, private Storage: Storage){

  }
   
  ionViewWillEnter(){
    this.Storage.get('location').then((val)=>{
      if (val != null){
        this.location = JSON.parse(val);
      } else{
        this.location= {
          city:'London',
          code:'UK'
          
        }
      }
      this.WeatherProvider.getWeather(
        this.location.city,
        this.location.code
      ).subscribe(weather => {
        this.weather = weather;
      })

      });
  
}

}