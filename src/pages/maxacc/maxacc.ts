import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Paho } from 'ng2-mqtt/mqttws31';
import * as HighCharts from 'highcharts';
import { GlobalProvider } from "../../providers/global/global";


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
  pOneYDatArray: number[] = [];
  pTwoYDatArray: number[] = [];
  maxOne: number = 0;
  maxTwo: number = 0;
  chart: any;
  player: any = "none";

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalProvider) {
  }

  ionViewDidLoad() {

      this.chart = HighCharts.chart('values', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Accumulated Acceleration of senseBox MCU'
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
            name: "Player 1Y",
            data: this.pOneYDatArray
          },
          {
            name: "Player 2",
            data: this.pTwoDatArray
          },
          {
            name: "Player 2Y",
            data: this.pTwoYDatArray
          }
          ]
      });
    

    // Create a client instance
    this.client = new Paho.MQTT.Client(this.global.mqttip, 11883, "clienId");
    

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
    this.client.subscribe("accelerometer/#");
    setTimeout( () => {
      this.client.unsubscribe("accelerometer/#");
      this.player = "none";
    }, 5000);
    
  }

  stopData() {
    this.player = "two";
    this.client.subscribe("accelerometer/#");
    setTimeout( () => {
      this.client.unsubscribe("accelerometer/#");
      this.player = "none";
  }, 5000);
  }

  deleteData() {
    this.pOneDatArray = [];
    this.chart.series[0].setData(this.pOneDatArray);
    this.pOneYDatArray = [];
    this.chart.series[1].setData(this.pOneYDatArray);
    this.pTwoYDatArray = [];
    this.chart.series[2].setData(this.pTwoYDatArray);
    this.pTwoDatArray = [];
    this.chart.series[3].setData(this.pTwoDatArray);
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
    if(this.player === "one") {
      if(message.destinationName === "accelerometer/tot"){
        this.pOneDatArray.push(+message.payloadString);
        // if(this.maxOne < +message.payloadString) {
        //   this.maxOne = +message.payloadString;
        // }
        // this.chart.series[0].setData(this.pOneDatArray);
      }
      else if(message.destinationName === "accelerometer/y") {
        this.pOneYDatArray.push(+message.payloadString * 9.81);
        this.chart.series[1].setData(this.pOneYDatArray);
        if(this.maxOne < Math.abs(+message.payloadString * 9.81)) {
          this.maxOne = Math.abs(+message.payloadString* 9.81);
        }
      }
    }
    else if(this.player === "two") {
      if(message.destinationName === "accelerometer/tot") {
        this.pTwoDatArray.push(+message.payloadString);
        // if(this.maxTwo < +message.payloadString) {
        //   this.maxTwo = +message.payloadString;
        // }
        // this.chart.series[2].setData(this.pTwoDatArray);
      }
      else if(message.destinationName === "accelerometer/y") {
        this.pTwoYDatArray.push(+message.payloadString * 9.81);
        this.chart.series[3].setData(this.pTwoYDatArray);
        if(this.maxTwo < Math.abs(+message.payloadString * 9.81)) {
          this.maxTwo = Math.abs(+message.payloadString * 9.81);
        }
      }
    }
  }
}
