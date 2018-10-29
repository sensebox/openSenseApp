import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyStartPage } from './sensify-start';

@NgModule({
  declarations: [
    SensifyStartPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyStartPage),
  ],
})
export class SensifyStartPageModule {}
