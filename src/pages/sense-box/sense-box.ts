import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Paho } from 'ng2-mqtt/mqttws31';
import * as HighCharts from 'highcharts';
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
  xchart: any;
  ychart: any;
  zchart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

      this.xchart = HighCharts.chart('xValues', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Acceleration on X-Axis'
        },
        xAxis: {
          title: {
            text: 'Measurements'
          }
        },
        yAxis: {
          title: {
            text: 'Value of Acceleration'
          }
        },
        series: [{
          data: this.xdatArray
          }]
      });

      this.ychart = HighCharts.chart('yValues', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Acceleration on X-Axis'
        },
        xAxis: {
          title: {
            text: 'Measurements'
          }
        },
        yAxis: {
          title: {
            text: 'Value of Acceleration'
          }
        },
        series: [{
          data: this.ydatArray
          }]
      });

      this.zchart = HighCharts.chart('zValues', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Acceleration on X-Axis'
        },
        xAxis: {
          title: {
            text: 'Measurements'
          }
        },
        yAxis: {
          title: {
            text: 'Value of Acceleration'
          }
        },
        series: [{
          data: this.zdatArray
          }]
      });
    

    // Create a client instance
    this.client = new Paho.MQTT.Client('10.0.1.71', 11883, "clienId");
    

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    // connect the this.client
    this.client.connect({onSuccess:this.onConnect.bind(this)});
    console.log(this.client);
    console.log('ionViewDidLoad SenseBoxPage');
  }

   // called when the this.client connects
  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    console.log(this.client);
    //this.client.subscribe("$SYS/#");
    this.client.subscribe("accelerometer/#");
    this.message = new Paho.MQTT.Message('1');
    this.message.destinationName = "/World";
    this.client.send(this.message); 
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
    if(message.destinationName === "accelerometer/x") {
      this.xdatArray.push(+message.payloadString);
    }
    this.xchart.series[0].setData(this.xdatArray);
    if(message.destinationName === "accelerometer/y") {
      this.ydatArray.push(+message.payloadString);
    }
    this.ychart.series[0].setData(this.ydatArray);
    if(message.destinationName === "accelerometer/z") {
      this.zdatArray.push(+message.payloadString);
    }
    this.zchart.series[0].setData(this.zdatArray);
    //this.datArray.push(+message.payloadString);
    // console.log(this.datArray);
    // this.chart.series[0].setData(this.datArray);
    // this.reloadHighchart();
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
