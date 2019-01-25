import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { map } from 'rxjs/operators';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the ForecastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html',
})
export class ForecastPage {

  name: string;
  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private api: ApiProvider) {
    console.log('Hello ApiProvider Provider');
    console.log("Yousef the id you are looking for: "+this.api.getBoxId());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForecastPage');
    this.checkName();

  }

  checkName() {

      this.http.get('http://localhost:8080/forecast').subscribe(response => {
          console.log('GET Response:', response);
          this.item = response;
      });

  }
}
