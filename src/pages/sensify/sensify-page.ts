import { ApiProvider } from '../../providers/api/api';
import { Location } from '../../providers/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-sensify',
  templateUrl: 'sensify-page.html',
})
export class SensifyPage {

  tab: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyPage');
  }

  changeTab(tab){
    this.tab = tab;
  }
  
}