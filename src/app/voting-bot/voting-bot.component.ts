import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Review } from 'src/review';

@Component({
  selector: 'app-voting-bot',
  templateUrl: './voting-bot.component.html',
  styleUrls: ['./voting-bot.component.scss'],
})
export class VotingBotComponent implements OnInit {
  opened: boolean = false;
  imgLink: any;
  reviews: any = {
    name: '',
    comment: '',
    imageLink: '',
  };

  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.getReview();
  }

  getReview() {
    this.afs
      .collection('review')
      .valueChanges()
      .subscribe((data: any) => {
        this.reviews = data.map((data: any) => {
          return data;
        });
      });
  }
}
