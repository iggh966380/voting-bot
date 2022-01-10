import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Article {
  title: string;
  comment: string;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() userId = '';
  fullArticle: Article = {
    title: '',
    comment: '',
  };
  constructor(private afs: AngularFirestore) {}

  isEdit: boolean = true;

  ngOnInit(): void {}

  ngOnChanges() {
    this.getFullArticle();
  }

  async getFullArticle() {
    if (this.userId) {
      const article = this.afs
        .collection('review')
        .doc(this.userId)
        .collection('article')
        .ref.get();
      article.then((data: any) => {
        this.fullArticle.title = data.docs[0].data().title;
        this.fullArticle.comment = data.docs[0].data().comment;
      });
    }
  }
}
