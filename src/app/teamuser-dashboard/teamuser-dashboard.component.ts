import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { AuthService } from '../auth/auth.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-teamuser-dashboard',
  templateUrl: './teamuser-dashboard.component.html',
  styleUrls: ['./teamuser-dashboard.component.css']
})
export class TeamuserDashboardComponent implements OnInit {

  public totalPendingTasks = 0;
  public totalCompletedTasks = 0;
  public average_time:string = "0 Min(s)";
  public dashboardDataSync:any;
  constructor(public authService: AuthService,public httpClientService: HttpClientService) {}

  ngOnInit(): void {
    let self = this;
		setTimeout(function() {
      self.getInfo();
		}, 200);

    // this.dashboardDataSync = setInterval(function() {
    //   self.getInfo(false);
    // }, 10000);
  }

  ngOnDestroy(): void {
    // clearInterval(this.dashboardDataSync);
  }

  getInfo(flag = true) {
		var self = this;
		if(flag) this.httpClientService.showLoader = true;
		this.httpClientService.get("dashboard/teamuser/data").subscribe(async function(res:any){
      self.httpClientService.showLoader = false;
			if (!res.error) {
        self.totalPendingTasks = res.data.totalPendingTasks;
        self.totalCompletedTasks = res.data.totalCompletedTasks;
        self.average_time = self.httpClientService.getAverageTime(res.data.average_time);
			}
			else {
        self.httpClientService.showLoader = false;
			}
      self.dashboardCompletedRecordTeamUser();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
  }

  dashboardCompletedRecordTeamUser(flag=true) {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.post("tasks/teamuser/dashboardcompleted", {}).subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      self.calculateDataForGraph(res.data.completed_record);
      if (!res.error) {
        
      }
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  calculateDataForGraph(graphData) {
    var actualGraphData = {
      completedEachDay: {labels: graphData.labels, data: graphData.data},
      cumulativeJobCompleted: {labels: graphData.labels, data: []},
      outstandingJobs: {labels: graphData.labels, data: []},
      burnDownChart: {labels: graphData.labels, data: []},
    };
    var value = 0;
    for (var i = 0; i < graphData.data.length; ++i) {
      value = i ? (actualGraphData.cumulativeJobCompleted.data[(i-1)] + graphData.data[i]) : graphData.data[i];
      actualGraphData.cumulativeJobCompleted.data.push(value);

      value = i ? actualGraphData.outstandingJobs.data[(i-1)] - graphData.data[i] : (graphData.total_records - graphData.data[i]);
      actualGraphData.outstandingJobs.data.push(value);
      // actualGraphData.cumulativeJobCompleted.data.push(value);
    }
    this.setGraphData(actualGraphData);
  }

  setGraphData(actualGraphData) {
    // Total Completed Each Day
    var completedEachDay:any = document.getElementById('completedEachDay');
    var completedEachDayctx = completedEachDay.getContext('2d');
    new Chart(completedEachDayctx, {
      type: 'line',
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      },
      data: {
          labels: actualGraphData.completedEachDay.labels,
          datasets: [{
              label: 'Completed records',
              data: actualGraphData.completedEachDay.data,
              fill: false,
              lineTension: 0,
              borderWidth: 2,
              borderColor: 'rgba(43, 84, 163, 1)'
          }]
      }
    });

    // Cumulative Jobs Completed
    // var cumulativeJobCompleted:any = document.getElementById('cumulativeJobCompleted');
    // var cumulativeJobCompletedctx = cumulativeJobCompleted.getContext('2d');
    // new Chart(cumulativeJobCompletedctx, {
    //   type: 'line',
    //   options: {
    //       scales: {
    //           yAxes: [{
    //               ticks: {
    //                   beginAtZero: true
    //               }
    //           }]
    //       }
    //   },
    //   data: {
    //       labels: actualGraphData.cumulativeJobCompleted.labels,
    //       datasets: [{
    //           label: 'Completed records',
    //           data: actualGraphData.cumulativeJobCompleted.data,
    //           fill: false,
    //           lineTension: 0,
    //           borderWidth: 2,
    //           borderColor: 'rgba(43, 84, 163, 1)'
    //       }]
    //   }
    // });

    // Total Jobs Outstanding
    var outstandingJobs:any = document.getElementById('outstandingJobs');
    var outstandingJobsctx = outstandingJobs.getContext('2d');
    new Chart(outstandingJobsctx, {
      type: 'line',
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                    // min: -2,
                    // max: 4,
                    // stepSize: 100,
                    // fixedStepSize: 1,
                    beginAtZero: true
                  }
              }]
          }
      },
      data: {
          labels: actualGraphData.outstandingJobs.labels,
          datasets: [{
              label: "Outstanding records",
              data: actualGraphData.outstandingJobs.data,
              fill: false,
              lineTension: 0,
              borderWidth: 2,
              borderColor: 'rgba(43, 84, 163, 1)'
          }]
      }
    });

    
  }
}
