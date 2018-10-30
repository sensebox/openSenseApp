import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'sensify-page-start',
  templateUrl: 'sensify-start.html',
})
export class SensifyStartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyStartPage');
  }

}
