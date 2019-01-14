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
    this.loadChart();
  }

  loadChart() {
    let ctx = document.getElementById("boxChart");
    this.sensorChart = new chart(ctx, {
      type: 'bar',
      /*data:{
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
      },*/
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

  loadDropDown(){
    let drpDwnDv = document.getElementById("dropDown");
    this.api.getSenseboxData().subscribe(data => {
      data.sensors.forEach( sensor =>{
        let opt = document.createElement("option");
        opt.innerHTML = sensor.title; // whatever property it has
        opt.value = sensor._id;
        // then append it to the select element
        drpDwnDv.appendChild(opt);
      });
    })
  }

  populateChart (value){
    debugger;
    this.api.setSensorId(value);
    let data = this.api.getSensorData();
    data.subscribe(sensorData =>{
      let chartData = [];
      sensorData.forEach(entry =>{
        chartData.push(entry.value)
      });

      let chartLabel = [];
      sensorData.forEach(entry =>{
        chartLabel.push(entry.createdAt)
      });
      this.sensorChart.data.datasets.data=chartData;
      this.sensorChart.data.datasets.labels=chartLabel;
      this.sensorChart.update();
    })

  }
}


