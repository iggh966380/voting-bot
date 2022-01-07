import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';

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
  }): void {}

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {}

  opened: boolean = false;
  reviews: any[] = [];
  public data: string[] | number[] = [];
  public labels: string[] | number[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  searchResult: boolean = false;
  resultList: any = [];

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
    const result = await this.afs.collection('review').ref.get();
    result.forEach((element) => {
      const data = element.data();
      this.reviews.push({
        data,
        id: element.id,
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
    const result = await this.afs.collection('review').ref.get();
    result.forEach((data: any) => {
      return newData.push(data.data().like);
    });
    this.reviews[index].data.like = newData[index];
    this.updateChart(newData);
  }

  public updateChart(value: any): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = value;

    this.chart?.update();
  }

  getResNameArr() {
    let name: string[] = [];
    this.reviews.forEach((data) => {
      name.push(data.data.name);
    });
    return name;
  }

  userArr: string[] = [];
  getUserInput(event: any): any {
    let idx: any = [];
    if (event.data) {
      this.searchResult = true;
      const result = this.getResNameArr();
      const arr = (query: string) => {
        return result.filter((el) => {
          return el.toLowerCase().indexOf(query.toLocaleLowerCase()) > -1;
        });
      };
      const index = arr(event.target.value);
      for (let element of index) {
        result.forEach((data) => {
          if (element === data) {
            idx.push(result.indexOf(data));
          }
        });
      }
      this.resultList = [];
      idx.forEach((index: number) => {
        this.resultList.push(this.reviews[index]);
      });
    } else {
      this.resultList = [];
    }
  }

  reRenderView() {}
}
