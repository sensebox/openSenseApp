import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForecastPage');
  }

  getData2(){
    alert("hello bro");
  }

  displayAge(){ 
    alert("hello bro111");
    document.getElementById("feedback").innerHTML = "Age =";

    var myPythonScriptPath = 'forecast.py';

// Use python shell
//let {PythonShell} = require('python-shell')
//import { PythonShell } from 'python-shell';
var pyshell = new PythonShell(myPythonScriptPath);

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err){
        throw err;
    };

    console.log('finished');
});
  }

  


}
