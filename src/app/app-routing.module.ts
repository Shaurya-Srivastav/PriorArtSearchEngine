import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path:'', redirectTo:"search", pathMatch:"full"},
  { path : 'search', component:SearchComponent}, 
  { path : 'results', component:ResultsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
