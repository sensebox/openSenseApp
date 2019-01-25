import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LandingPage } from '../landing-page/landing-page';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',

})
export class SettingsPage {
    city:string;
    code:string;

   constructor(public navCtrl:NavController, public navParams:NavParams, private Storage: Storage){
    this.Storage.get('location').then((val)=>{
      if (val != null){
        let location = JSON.parse(val);
        this.city = location.city;
        this.code = location.code;


      } else{
        this.city=' London';
        this.code='uk';

      }

    });

}

ionViewDidLoad(){
  console.log('ionViewDidLoad SettingsPage');
}

saveForm(){
  let location ={
    city: this.city,
    code: this.code


  }
  this.Storage.set('location', JSON.stringify(location));
  this.navCtrl.push(LandingPage);
  }
} 