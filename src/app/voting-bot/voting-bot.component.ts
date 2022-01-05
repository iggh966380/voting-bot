import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot,
} from '@angular/fire/compat/firestore';
import {
  Chart,
  ChartItem,
  Point,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
} from 'chart.js';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Data } from './typing';

Chart.register(LinearScale, BarController, BarElement, CategoryScale);

@Component({
  selector: 'app-voting-bot',
  templateUrl: './voting-bot.component.html',
  styleUrls: ['./voting-bot.component.scss'],
})
export class VotingBotComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  opened: boolean = false;
  reviews: any[] = [];
  public data: string[] | number[] = [];
  public labels: string[] | number[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  constructor(private afs: AngularFirestore) {}

  async ngOnInit() {
    await this.getReview();
    const [resName, resLike] = this.pushArr();
    this.labels = resName;
    this.data = resLike;
    this.initChart();
  }

  getReviewData() {
    return this.reviews;
  }

  async getReview() {
    await this.afs
      .collection('review')
      .ref.get()
      .then((docs) => {
        docs.forEach((element) => {
          const data = element.data();
          this.reviews.push({
            data,
            id: element.id,
          });
        });
      });
  }

  pushArr() {
    const resName: string[] = [];
    const resLike: number[] = [];
    for (let index of this.reviews) {
      resName.push(index.data.name);
      resLike.push(index.data.like);
    }
    return [resName, resLike];
  }

  async addLike(event: any) {
    let targetIndex = event.path[2].attributes[2].value;
    const data = this.getReviewData();
    let id = data[targetIndex].id;
    const doc = this.afs.collection('review').doc(id).ref;
    await this.afs.firestore.runTransaction((transaction) =>
      transaction.get(doc).then((data: any) => {
        const newLike = data.data().like + 1;
        transaction.update(doc, { like: newLike });
      })
    );
    this.updateData(targetIndex);
  }

  initChart() {
    this.barChartData = {
      labels: this.labels,
      datasets: [{ data: <number[]>this.data, label: '# for votes' }],
    };
    return this.barChartData;
  }

  async updateData(index: number) {
    let newData: number[] = [];
    this.afs
      .collection('review')
      .snapshotChanges()
      .subscribe((data: any) => {
        this.reviews[index].data.like = data[index].payload.doc.data().like;
        for (let index of data) {
          newData.push(index.payload.doc.data().like);
        }
        this.updateChart(newData);
      });
  }

  public updateChart(value: any): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = value;

    this.chart?.update();
  }
}
