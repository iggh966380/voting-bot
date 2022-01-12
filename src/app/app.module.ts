import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { VotingBotModule } from './voting-bot/voting-bot.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    AngularFireStorageModule,
    VotingBotModule,
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
