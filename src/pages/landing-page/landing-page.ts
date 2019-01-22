import {Component } from '@angular/core';
import {ModalController,NavController} from 'ionic-angular';
import {WeatherProvider} from '../../providers/api/weather';

import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-landing',
  templateUrl: 'landing-page.html',
  providers:[WeatherProvider]
})
export class LandingPage {
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