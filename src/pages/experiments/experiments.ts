import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PendulumPage } from '../pendulum/pendulum';

/**
 * Generated class for the ExperimentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-experiments',
  templateUrl: 'experiments.html',
})
export class ExperimentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExperimentsPage');
  }

  btnClick() {
    this.navCtrl.push(PendulumPage);
  }

}
