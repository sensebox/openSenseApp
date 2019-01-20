import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import chart from 'chart.js/dist/Chart.js';

/**
 * Generated class for the LeafletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'graphs.html',
})
export class GraphsPage {
  sensorChart: any;
  statisticData: any;
  sensorData: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.loadDropDown();
  }
  //populate drop down based on available sensors of the selected sensebox
  loadDropDown() {
    this.api.getSenseboxData().subscribe(data => {
      let sensorarray : any = data;
      sensorarray.sensors.forEach(sensor => {
        this.sensorData.push({
          title: sensor.title,
          value: sensor._id
        });
      });
    })
  }

  //populate chart based on the selected sensor
  populateChart(sensorId) {
    let data = this.api.getSensorData(sensorId);
    data.subscribe(sensorData => {
      let sensorDataArray : any = sensorData;
      let ctx :any = document.getElementById("boxChart");
      //if no data is available print a hint on screen
      if(sensorDataArray.length<1){
        if(this.sensorChart){
          this.sensorChart.destroy();
        }
        let canvas = ctx.getContext("2d");
        canvas.font = "20px Ionicons";
        canvas.fillStyle = "red";
        canvas.textAlign = "justify";
        canvas.fillText("No data available.", 10, 50);
        return;
      }
      let splittedArray = this.splitIntoDaysArray(sensorDataArray);
      let chartData = this.getMinAndMax(splittedArray[0]);
      let chartLabel = splittedArray[1];
      if(this.sensorChart){
        this.sensorChart.destroy();
      }
      //create chart
      this.sensorChart = new chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabel,
          datasets: [{
            label: "Sensor Graph",
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              stacked: true,
              gridLines: {
                display: true,
                color: "rgba(255,99,132,0.2)"
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      });
    });
  }
  //split the sensor data into data for each day, find min and max values for each day and create labals for data
  splitIntoDaysArray(array) {
    let arrayForCreatedAtArrays = [];
    let createdAt = array[0].createdAt.split("T")[0];
    let labelArray = [];
    console.log(createdAt);
    let tempArray = [];
    array.forEach((entry) => {
      if (entry.createdAt.split("T")[0] === createdAt) {
        tempArray.push(entry)
      } else {
        arrayForCreatedAtArrays.push(tempArray);
        tempArray = [];
        labelArray.push(createdAt.substring(5) + " minValue");
        labelArray.push(createdAt.substring(5) + " maxValue");
        createdAt = entry.createdAt.split("T")[0];
      }
    });
    return [arrayForCreatedAtArrays, labelArray];
  }

  // get min and max values of data arrays
  getMinAndMax(arrays) {
    let chartData = [];
    let minValue = 55;
    let maxValue = -50;
    arrays.forEach(array => {
      array.forEach(entry => {
        if (entry.value < minValue) {
          minValue = entry.value
        }
        if (entry.value > maxValue) {
          maxValue = entry.value
        }
      });
      chartData.push(minValue);
      chartData.push(maxValue);
      minValue = 55;
      maxValue = -50;
    });

    return chartData;

  }


}


