export interface Location {
	latitude: number;
	longitude: number;
}

export interface Sensor {
	title: String;
	unit: String;
	lastMeasurement: String;
	sensorType: String;
	id: String;
}

export interface SenseBox {
	name: String;
	coordinates: Location;
	model: String;
	grouptag: String;
	description: String;
	createdAt: String;
	updatedAt: String;
	sensors: Sensor[];
	_id: String;
}
