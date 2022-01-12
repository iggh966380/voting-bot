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

  id: string = '';
  constructor(private afs: AngularFirestore) {}

  isEdit: boolean = true;

  ngOnInit(): void {}

  ngOnChanges() {
    this.getFullArticle();
  }

  getFullArticle() {
    if (this.userId) {
      const article = this.afs
        .collection('review')
        .doc(this.userId)
        .collection('article')
        .ref.get();
      article.then((data: any) => {
        this.fullArticle.title = data.docs[0].data().title;
        this.fullArticle.comment = data.docs[0].data().comment;
        this.id = data.docs[0].id;
      });
    }
  }

  async sendChange(): Promise<any> {
    const title = document.querySelector('#updatedTitle') as HTMLInputElement;
    const comment = document.querySelector(
      '#updatedComment'
    ) as HTMLTextAreaElement;
    const updatPost = {
      title: title.value,
      comment: comment.value,
    };
    const postDoc = this.afs
      .doc(`/review/${this.userId}`)
      .collection('article')
      .doc(this.id).ref;

    await this.afs.firestore.runTransaction((transaction) =>
      transaction.get(postDoc).then(() => {
        transaction.update(postDoc, {
          title: updatPost.title,
          comment: updatPost.comment,
        });
      })
    );
  }

  deletePost() {
    // const article = this.afs
    //   .doc(`/review/${this.userId}`)
    //   .collection('article')
    //   .doc(this.id)
    //   .ref.get();
    // article.then((data) => {
    //   console.log(data.data());
    // });
    // console.log(this.id);
    this.afs
      .doc(`/review/${this.userId}`)
      .collection('article')
      .doc(this.id)
      .delete();
  }
}
