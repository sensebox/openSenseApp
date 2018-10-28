import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyPage } from './sensify-page';

@NgModule({
  declarations: [
    SensifyPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyPage),
  ],
})
export class SensifyPageModule {}
