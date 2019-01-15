import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Paho } from 'ng2-mqtt/mqttws31';
import * as HighCharts from 'highcharts';

/**
 * Generated class for the MaxaccPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maxacc',
  templateUrl: 'maxacc.html',
})
export class MaxaccPage {


  boxData: any;
  client: any;
  message: any;
  pOneDatArray: number[] = [];
  pTwoDatArray: number[] = [];
  maxOne: number = 0;
  maxTwo: number = 0;
  chart: any;
  player: any = "none";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

      this.chart = HighCharts.chart('values', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Your Acceleration series'
        },
        xAxis: {
          title: {
            text: 'Milliseconds * 100'
          },
          tickInterval: 10, // one week
          tickWidth: 0,
          gridLineWidth: 1,
          labels: {
              align: 'left',
              x: 3,
              y: -3
          }
      },
        yAxis: {
          title: {
            text: 'm/s^2'
          }
        },
        series: [{
            name: "Player 1",
            data: this.pOneDatArray
          },
          {
            name: "Player 2",
            data: this.pTwoDatArray
          }
          ]
      });
    

    // Create a client instance
    this.client = new Paho.MQTT.Client('192.168.0.130', 11883, "clienId");
    

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    // connect the this.client
    this.client.connect({onSuccess:this.onConnect.bind(this)});
    console.log(this.client);
    console.log('ionViewDidLoad MaxAccPage');
  }


  getData() {
    this.player = "one";
    this.client.subscribe("accelerometer/tot");
    setTimeout( () => {
      this.client.unsubscribe("accelerometer/tot");
      this.player = "none";
    }, 5000);
    
  }

  stopData() {
    this.player = "two";
    this.client.subscribe("accelerometer/tot");
    setTimeout( () => {
      this.client.unsubscribe("accelerometer/tot");
      this.player = "none";
  }, 5000);
  }

  deleteData() {
    this.pOneDatArray = [];
    this.chart.series[0].setData(this.pOneDatArray);
    this.pTwoDatArray = [];
    this.chart.series[1].setData(this.pTwoDatArray);
    this.maxOne = 0;
    this.maxTwo = 0;
  }

   // called when the this.client connects
  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    console.log(this.client);
  }

  // called when the this.client loses its connection
  onConnectionLost(responseObject) {
    console.log(responseObject);
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  onMessageArrived = (message) => {
    console.log("onMessageArrived:", message.destinationName, message.payloadString);
    if(message.destinationName === "accelerometer/tot" && this.player === "one") {
      this.pOneDatArray.push(+message.payloadString);
      if(this.maxOne < +message.payloadString) {
        this.maxOne = +message.payloadString;
      }
    }
    this.chart.series[0].setData(this.pOneDatArray);
    if(message.destinationName === "accelerometer/tot" && this.player === "two") {
      this.pTwoDatArray.push(+message.payloadString);
      if(this.maxTwo < +message.payloadString) {
        this.maxTwo = +message.payloadString;
      }
    }
    this.chart.series[1].setData(this.pTwoDatArray);
  }
 }
