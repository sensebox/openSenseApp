import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyMapPage } from './sensify-map';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    SensifyMapPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyMapPage),
    LeafletModule,
    LeafletModule.forRoot()
  ],
  providers: [
    Geolocation
  ]
})
export class MapPageModule {}
