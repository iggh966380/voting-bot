import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { VotingBotRoutingModule } from './voting-bot-routing.module';
import { VotingBotComponent } from './voting-bot.component';
import { PostComponent } from './post/post.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchlistComponent } from './searchlist/searchlist.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    VotingBotComponent,
    PostComponent,
    UploadComponent,
    SearchlistComponent,
  ],
  imports: [
    CommonModule,
    VotingBotRoutingModule,
    NgChartsModule,
    MatToolbarModule,
    MatSliderModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [VotingBotComponent],
})
export class VotingBotModule {}
