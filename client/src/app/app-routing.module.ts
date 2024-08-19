import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetectComponent } from './pages/detect/detect.component';
import { EnrolComponent } from './pages/enrol/enrol.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detect', component: DetectComponent },
  { path: 'enrol', component: EnrolComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
