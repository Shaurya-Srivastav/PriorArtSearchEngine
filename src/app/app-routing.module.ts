import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path:'', redirectTo:"home", pathMatch:"full"},
  { path : 'home' , component:HomeComponent}, 
  { path : 'search', component:SearchComponent}, 
  { path : 'results', component:ResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
