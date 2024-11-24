import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AddRecordComponent } from './components/add-record/add-record.component';
import { AllRecordsComponent } from './components/all-records/all-records.component';

const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: 'add-record', component: AddRecordComponent },
  { path: '', component: AllRecordsComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
