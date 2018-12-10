import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendulumPage } from './pendulum';

@NgModule({
  declarations: [
    PendulumPage,
  ],
  imports: [
    IonicPageModule.forChild(PendulumPage),
  ],
})
export class PendulumPageModule {}
