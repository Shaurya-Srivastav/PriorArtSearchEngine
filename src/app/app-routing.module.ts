import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { SavedComponent } from './saved/saved.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path:'', redirectTo:"search", pathMatch:"full"},
  { path : 'search', component:SearchComponent, canActivate: [AuthGuard]}, 
  { path : 'results', component:ResultsComponent, canActivate: [AuthGuard]},
  { path: 'saved', component:SavedComponent, canActivate: [AuthGuard]}, 
  { path: 'login', component:LoginComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
