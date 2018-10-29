import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    MapPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPage),
    LeafletModule,
    LeafletModule.forRoot()
  ],
  providers: [
    Geolocation
  ]
})
export class MapPageModule {}
