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


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.loadDropDown();
  }

  /*loadChart() {
    let ctx = document.getElementById("boxChart");
    this.sensorChart = new chart(ctx, {
      type: 'line',
      data:{
       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }*/

  loadDropDown() {
    let drpDwnDv = document.getElementById("dropDown");
    this.api.getSenseboxData().subscribe(data => {
      data.sensors.forEach(sensor => {
        let opt = document.createElement("option");
        opt.innerHTML = sensor.title; // whatever property it has
        opt.value = sensor._id;
        // then append it to the select element
        drpDwnDv.appendChild(opt);
      });
    })
  }

  populateChart(value) {
    console.log(value);
    let data = this.api.getSensorData(value);
    data.subscribe(sensorData => {
      let splittedArray = this.splitIntoDaysArray(sensorData);
      let chartData = this.getMinAndMax(splittedArray[0]);
      let chartLabel = splittedArray[1];
      let ctx = document.getElementById("boxChart");
      ctx.innerHTML = "";
      this.sensorChart = new chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabel,
          datasets: [{
            label: "Sensor Graph",
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      /* this.sensorChart.data.datasets.data = chartData;
       this.sensorChart.data.labels = chartLabel;
       this.sensorChart.data.datasets.label = "Sensor Graph";
       this.sensorChart.update(); */
    });
  }

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
        labelArray.push(createdAt + " minValue");
        labelArray.push(createdAt + " maxValue");
        createdAt = entry.createdAt.split("T")[0];
      }
    });
    return [arrayForCreatedAtArrays, labelArray];
  }

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


