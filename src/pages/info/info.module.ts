import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoPage } from './info';

@NgModule({
  declarations: [
    InfoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoPage),
  ],
})
export class GraphsPageModule {}
export class InfoPageModule {}