import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { HttpClientModule } from "@angular/common/http";

import { FormsModule } from '@angular/forms';

import { NgxLoadingModule } from 'ngx-loading';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//environments
import { environment } from 'src/environments/environment.prod';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { SavedComponent } from './saved/saved.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    SavedComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
