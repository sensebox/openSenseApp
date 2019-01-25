import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeafletPage } from './leaflet';

@NgModule({
  declarations: [
    LeafletPage,
  ],
  imports: [
    IonicPageModule.forChild(LeafletPage),
  ],
})
export class LeafletPageModule {}
