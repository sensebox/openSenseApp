import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Location, SenseBox } from '../model';
import { GlobalProvider } from '../global/global';


@Injectable()
export class ApiProvider {

	private API_URL = 'https://api.opensensemap.org';
	private sumTemp: any = 0;
	private nSensors: any = 0;

	constructor(public http: HttpClient, public global: GlobalProvider) {
		console.log('Hello ApiProvider Provider');
	}

	getData() {
		return this.http.get(`${this.API_URL}/boxes/5b0d436fd40a290019ef444d`);
	}

	getSenseBoxes() {
		return this.http.get(`${this.API_URL}/boxes?exposure=outdoor,mobile,unknown`);
	}

	getAllSenseBoxes() {
		return this.http.get(`${this.API_URL}/boxes?exposure=outdoor,unknown`);
	}

	getClosestSenseBoxes(userLocation: Location): Observable<SenseBox[]> {
		let closestSenseBoxes = [];

		return this.http.get(`${this.API_URL}/boxes?exposure=outdoor, unknown`).map(res => {
			let allBoxes: any = res;

			allBoxes.forEach(element => {
				let boxLocation: Location = {
					latitude: element.currentLocation.coordinates[1],
					longitude: element.currentLocation.coordinates[0]
				};
				let distance: number = this.calculateDistance(userLocation, boxLocation);
				if (distance <= this.global.radius) {

					let box: SenseBox = {
						name: element.name,
						coordinates: boxLocation,
						model: element.model,
						grouptag: element.grouptag,
						description: element.description,
						createdAt: element.createdAt,
						updatedAt: element.updatedAt,
						sensors: element.sensors,
						_id: element._id
					}

					closestSenseBoxes.push(box);
				}
			});
			return closestSenseBoxes;
		})
	}

	calculateDistance(userLocation: Location, senseBoxLocation: Location) {
		// Deg --> Rad
		let lat1 = userLocation.latitude * Math.PI / 180;
		let lat2 = senseBoxLocation.latitude * Math.PI / 180;
		let lng1 = userLocation.longitude * Math.PI / 180;
		let lng2 = senseBoxLocation.longitude * Math.PI / 180;
		// distance calculation:
		let cosG = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
		let dist = 6378.388 * Math.acos(cosG);
		return dist;
	};

	getclosestSenseBox(boxes: SenseBox[], location: Location) {
		let closestBoxes: any = boxes;
		let userLocation: any = location;
		let index: any = 0;
		let minDistance: any = Number.MAX_VALUE;
		let i = 0;
		closestBoxes.forEach(box => {
			let boxLocation: Location = {
				latitude: box.coordinates.latitude,
				longitude: box.coordinates.longitude
			};

			let distance = this.calculateDistance(userLocation, boxLocation)
			if (distance < minDistance) {
				index = i;
				minDistance = distance;
			}
			i++;
		});
		let closestSenseBox = {
			box: closestBoxes[index],
			index: index
		}
		return closestSenseBox;
	}

	getclosestSenseBoxTest(boxes: SenseBox[], location: Location): any {
		let index: any = 0;
		let minDistance: any = Number.MAX_VALUE;
		let i = 0;
		boxes.forEach(box => {
			let boxLocation: Location = {
				latitude: box.coordinates.latitude,
				longitude: box.coordinates.longitude
			};

			let distance = this.calculateDistance(location, boxLocation)
			if (distance < minDistance) {
				index = i;
				minDistance = distance;
			}
			i++;
		});
		let box: SenseBox = boxes[index];
		return box;
	}

	getBoxMeasurements(box_id: String) {
		let url = this.API_URL + "/boxes/" + box_id + "/sensors";
		return this.http.get(url);
	}

	getMeanTemp(cBoxes: SenseBox[]) {
		let closestBoxes: any = cBoxes;
		//dateused to look for sensors that provided measurements of TODAY
		let date = new Date();
		let dayOfMonth = date.getUTCDate();

		closestBoxes.forEach(box => {
			let sensors = box.sensors;
			sensors.forEach(sensor => {
				if (sensor.title == ("Temperatur" || sensor.title == "Temperature") && sensor.lastMeasurement != undefined) {
					//if yes get measurements from that box
					this.getBoxMeasurements(box._id).subscribe(res => {
						let boxMeasurements: any = res;
						boxMeasurements.sensors.forEach(element => {
							if (element.lastMeasurement) {
								//if values are from same day, in a certain interval, add to nSensors (number of used sensors) and sumTemp (sum of all temp values)
								let numMeasurement = parseFloat(element.lastMeasurement.value);
								let valueDate = element.lastMeasurement.createdAt.substring(8, 10);
								if (element.title == "Temperatur" || element.title == "Temperature") {
									if (valueDate == dayOfMonth) {
										if (numMeasurement > -20 && numMeasurement < 40) {
											this.nSensors += 1;
											this.sumTemp += numMeasurement;
										}
									}
								}
							}
						});
					})
				}
			});
		});
		let meanTemp: any = this.sumTemp / this.nSensors;
		return meanTemp;
	}

	//!!!! What should be the return statement? For now, only console output is given. Return statement should be discussed!
	validateSenseBoxTemperature(cBox: SenseBox, cBoxes: SenseBox[]) {
		let closestBox = cBox;
		let closestBoxes = cBoxes;
		let meanTemperature: any = this.getMeanTemp(closestBoxes);
		let range: any = this.global.tempRange; // +/- degree celsius

		if (meanTemperature) {
			this.getBoxMeasurements(closestBox._id).subscribe(res => {
				let values: any = res;
				values.sensors.forEach(sensor => {
					if (sensor.title == ("Temperatur" || sensor.title == "Temperature") && sensor.lastMeasurement != undefined) {
						let nearestBoxTemperature: any = parseFloat(sensor.lastMeasurement.value);
						if (meanTemperature - range < nearestBoxTemperature && meanTemperature + range > nearestBoxTemperature) {
							console.log("TEMPERATUR DER AKTUELLEN BOX IST OK");
							console.log("Mittlere Temp aller Boxen von heute:" + meanTemperature + "(+/- " + range + "), Temp der nächsten Box:" + nearestBoxTemperature);
						} else {
							console.log("TEMPERATUR DER AKTUELLEN BOX IS SELTSAM BRUHH");
							console.log("Mittlere Temp aller Boxen von heute:" + meanTemperature + "(+/- " + range + "), Temp der nächsten Box:" + nearestBoxTemperature);
						}
					};
				})
			})
		}
	}
}