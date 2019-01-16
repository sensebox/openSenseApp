import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Paho } from 'ng2-mqtt/mqttws31';
import * as HighCharts from 'highcharts';
import { GlobalProvider } from "../../providers/global/global";
/**
 * Generated class for the SenseBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sense-box',
  templateUrl: 'sense-box.html',
})
export class SenseBoxPage {

  boxData: any;
  client: any;
  message: any;
  xdatArray: number[] = [];
  ydatArray: number[] = []; 
  zdatArray: number[] = [];
  totDatArray: number[] = []; 
  xchart: any;
  ychart: any;
  zchart: any;
  connected: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalProvider) {
  }

  ionViewDidLoad() {

    HighCharts.setOptions({
      time: {
          timezone: 'Europe/Berlin'
      }
    });

      this.xchart = HighCharts.chart('xValues', {
        chart: {
          type: 'spline',
          zoomType: 'x',
          panning: true,
          panKey: 'shift'
        },
        title: {
          text: 'Acceleration of senseBox'
        },
        xAxis: {
          title: {
            text: 'Seconds'
          },
          type: 'datetime',
          // pointInterval: 100,
          tickInterval: 10000, // one week
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
            text: 'G-Force'
          }
        },
        plotOptions: {
          series: {
              marker: {
                  enabled: false
              }
          }
      },
        series: [{
            name: "X-Axis",
            data: this.xdatArray,
            pointStart: Date.now(), // first of April
            pointInterval: 100
          },
          {
            name: "Y-Axis",
            data: this.ydatArray,
            pointStart: Date.now(), // first of April
        pointInterval: 100,
          },
          {
            name: "Z-Axis",
            data: this.zdatArray,
            pointStart: Date.now(), // first of April
        pointInterval: 100
          },
          { name: "Total",
            data: this.totDatArray,
            pointStart: Date.now(), // first of April
        pointInterval: 100
          }]
      });
    
    // Create a client instance
    this.client = new Paho.MQTT.Client(this.global.mqttip, 11883, "clienId");
    

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    // connect the this.client
    this.client.connect({onSuccess:this.onConnect.bind(this)});
    console.log(this.client);
    console.log('ionViewDidLoad SenseBoxPage');
  }


  getData() {
    if(this.connected){
      this.client.subscribe("accelerometer/#");  
    }
  }

  stopData() {
    if(this.connected){
      this.client.unsubscribe("accelerometer/#");
    }
  }

  deleteData() {
    this.xdatArray = [];
    this.xchart.series[0].setData(this.xdatArray);
    this.ydatArray = [];
    this.xchart.series[1].setData(this.ydatArray);
    this.zdatArray = [];
    this.xchart.series[2].setData(this.zdatArray);
    this.totDatArray = [];
    this.xchart.series[3].setData(this.totDatArray);
  }

   // called when the this.client connects
  onConnect() {
    this.connected = true;
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
    this.connected = false;
  }

  // called when a message arrives
  onMessageArrived = (message) => {
    // console.log("onMessageArrived:", message.destinationName, message.payloadString);
    if(message.destinationName === "accelerometer/x") {
      this.xchart.series[0].addPoint(+message.payloadString, true, false, false);
      // this.xdatArray.push(+message.payloadString);
      // this.xchart.series[0].setData(this.xdatArray);
    }
    else if(message.destinationName === "accelerometer/y") {
      // this.ydatArray.push(+message.payloadString);
      // this.xchart.series[1].setData(this.ydatArray);
      this.xchart.series[1].addPoint(+message.payloadString, true, false, false);
    }
    else if(message.destinationName === "accelerometer/z") {
      // this.zdatArray.push(+message.payloadString);
      // this.xchart.series[2].setData(this.zdatArray);
      this.xchart.series[2].addPoint(+message.payloadString, true, false, false);
    }
    else if(message.destinationName === "accelerometer/tot") {
      // this.totDatArray.push(+message.payloadString/9.81);
      // this.xchart.series[3].setData(this.totDatArray);
      this.xchart.series[3].addPoint((+message.payloadString/9.81), true, false, false);
    }
  }

//   reloadHighchart() {
//     chart = HighCharts.chart('xValues', {
//       chart: {
//         type: 'spline'
//       },
//       title: {
//         text: 'Acceleration on X-Axis'
//       },
//       xAxis: {
//         title: {
//           text: 'Measurements'
//         }
//       },
//       yAxis: {
//         title: {
//           text: 'Value of Acceleration'
//         }
//       },
//       series: [{
//         data: this.datArray
//         }]
//     });
//   }
 }
