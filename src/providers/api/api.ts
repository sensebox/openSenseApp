import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Location, Sensor, SenseBox } from '../model';
// import { map } from 'rxjs/operators';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

	private API_URL = 'https://api.testing.opensensemap.org';
	private boxes;

	constructor(public http: HttpClient) {
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


	getClosestSenseBoxes(userLocation: Location): Observable <SenseBox[]> {
		let closestSenseBoxes = [];

		return this.http.get(`${this.API_URL}/boxes?exposure=outdoor,unknown`).map(res => {
			let allBoxes: any = res;

			allBoxes.forEach(element => {
				let boxLocation: Location = {
					latitude: element.currentLocation.coordinates[1],
					longitude: element.currentLocation.coordinates[0]
				};
				let distance: number = this.calculateDistance(userLocation, boxLocation);
				if (distance <= 20) {

					let box: SenseBox = {
						name: element.name,
						coordinates: boxLocation,
						model: element.model,
						grouptag: element.grouptag,
						description: element.description,
						createdAt: element.createdAt,
						updatedAt: element.updatedAt,
						sensors: element.sensors
					}

					closestSenseBoxes.push(box);
				}
			});
			return closestSenseBoxes;
		})
	}

	public calculateDistance(userLocation: Location, senseBoxLocation: Location) {
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
}
