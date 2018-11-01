import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications'

@Component({
  selector: 'sensify-page-about',
  templateUrl: 'sensify-about.html',
})
export class SensifyAboutPage {
  newRadius : any;
  newValidationRange : any;
  newSenseboxID : any

  constructor(public navCtrl: NavController,public alertCrtl: AlertController ,public navParams: NavParams,private plt: Platform ,private localNotifications: LocalNotifications) {
    //if testing on device  (because notifications cant be tested on browser)
    if (this.plt.is('cordova')) {
      this.plt.ready().then(rdy =>{
        this.localNotifications.on('click').subscribe(res =>{
          alert(res.data.mydata)
        });
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyAboutPage');
  }

  testNotifications(){
    if (this.plt.is('cordova')) {
      this.localNotifications.schedule({
        id:1,
        trigger: {at: new Date(new Date().getTime()+ 1000)}, //1000 ms = 1sec
        title: "Sensify News",
        text: 'ALOHA I BIMS. EINS NOTIFICATIONS', 
        data: {mydata: "Hier könnte ihre Webung stehen <3 "}
      })
    }else{
      alert("You can't test Notifications in the browser bro... Use an emulator!");
    }
  }

  //SETTINGS
  //TODO
  //-save inputs in other variables on button press so that they dont vanish when switching between tabs
  //-show current settings in the fields
  //-Think about other setting options that we need
  test(){
    alert("radius:"+this.newRadius+",       validationRange:"+this.newValidationRange+",        SenseBoxID:"+this.newSenseboxID)
  }
}
