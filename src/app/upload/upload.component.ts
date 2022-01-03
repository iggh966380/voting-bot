import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { finalize, Observable } from 'rxjs';
import { Review } from 'src/review';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @ViewChild('dialogTemplate')
  dialogTemplate!: TemplateRef<any>;

  fileToUpload: any;
  srcResult: any;
  fileOnSelected: string = '';
  errorMsg: string = '';
  uploadStatus: boolean = false;
  uploadResult: string = '';
  resName: string = '';
  downloadURL!: Observable<string>;
  comment: Review = {
    name: '',
    comment: '',
    imageLink: '',
  };
  afCollection: any;

  constructor(
    private afstore: AngularFirestore,
    private afs: AngularFireStorage,
    private md: MatDialog
  ) {}

  ngOnInit(): void {}

  uploadFile(): void {
    if (this.fileToUpload !== undefined) {
      const filePath = this.fileToUpload.name;
      const ref = this.afs.ref(filePath);
      const task = ref.put(this.fileToUpload);
      this.fileOnSelected = '';
      task
        .then(() => {
          this.uploadStatus = true;
          if (this.uploadStatus) {
            this.uploadResult = '上傳成功';
            this.openDialog();
            const uploadPercent = task.percentageChanges().subscribe();
            task
              .snapshotChanges()
              .pipe(
                finalize(() => {
                  this.downloadURL = ref.getDownloadURL();
                  this.downloadURL.subscribe((data) => {
                    this.comment.imageLink = data;
                    this.uploadComment();
                  });
                })
              )
              .subscribe();
          }
        })
        .catch((err) => {
          this.uploadResult = '上傳失敗';
          this.openDialog();
          console.log(err);
        });
    } else {
      this.errorMsg = '請先選擇檔案';
    }
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.fileToUpload = <File>inputNode.files[0];
    this.fileOnSelected = this.fileToUpload.name;

    // if (typeof FileReader !== 'undefined') {
    //   const reader: FileReader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.srcResult = e.target.result;
    //     console.log(this.srcResult);
    //   };

    // console.log(inputNode.files[0]);
    // console.log(reader.result);
    // }
  }

  openDialog() {
    this.md.open(this.dialogTemplate);
  }

  getResturantName(event: Event) {
    this.comment.name = (event.target as HTMLInputElement).value;
  }

  getResturantComment(event: Event) {
    this.comment.comment = (event.target as HTMLTextAreaElement).value;
  }

  uploadComment() {
    this.afstore.collection(`/review`).add(this.comment);
  }
}
