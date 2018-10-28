import { ApiProvider } from '../../providers/api/api';
import { Location } from '../../providers/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SensifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sensify',
  templateUrl: 'sensify-page.html',
})
export class SensifyPage {

  boxData: any;
  allBoxes: any;
  closestBoxes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyPage');
  }

  getData(){
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
    })

  }

  getSenseBoxes(){
    this.api.getSenseBoxes().subscribe(res => {
      console.log(res);
      this.allBoxes = res;
    })
  }

  getClosestSenseBox(){
    let myLocation : Location = {
      longitude : 7.6261347, 
      latitude : 51.9606649
    }

    this.api.getClosestSenseBoxes(myLocation).subscribe(res => {       
      this.closestBoxes = res;
      console.log('loaded closest boxes');
      console.log(this.closestBoxes);
    });

  }
}