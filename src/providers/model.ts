export interface Location {
    latitude: number;
    longitude: number;
}

export interface Sensor {
    title: String;
    unit: String;
    lastMeasurement: {
        value: String;
    };
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

export interface Settings {
    gps: boolean;
    location?: Location;
    radius: number;
    mySenseBox?: String;
    ranges: {
        temperature: number;
    };
}

export interface Metadata {
    settings: Settings;
    senseBoxes?: SenseBox[]; // Contains Closest SenseBoxes defined by radius and user location
    closestSenseBox?: SenseBox;
}
