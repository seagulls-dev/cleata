import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public totalTeams = 0;
  public totalTeamUsers = 0;
  public totalTasks = 0;
  public totalPendingTasks = 0;
  public totalCompletedTasks = 0;
  public totalUnassignedTasks = 0;
  public average_time:string = "0 Min(s)";
  public min_date = new Date();
  public dashboardDataSync:any;
  public tasksData:any = [];
  public teamsData: any = [];
  public dashboardAnalyticsForm: FormGroup;
  public dashboardChartForm: FormGroup;
  public dashboardBurnDownForm: FormGroup;
  private teamUserJobsChart:any;
  private completedEachDayChart:any;
  private cumulativeJobCompletedChart:any;
  private outstandingJobsChart:any;
  private burnDownChart:any;




  constructor(public authService: AuthService,public httpClientService: HttpClientService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.dashboardAnalyticsForm = fb.group({
      task_id: [""],
      team_id: [""]
    });

    this.dashboardChartForm = fb.group({
      task_id: [""],
      team_id: [""],
      start_date: [""],
      end_date: [""],
    });

    this.dashboardBurnDownForm = fb.group({
      task_id: [""],
      team_id: [""]
    });
    var stripe_callback = route.snapshot.params.stripe_callback;
    var stripe_session_id = route.snapshot.params.stripe_session_id;
    if(stripe_callback == "success" && stripe_session_id) {
      this.subscriptionAddCheckout(stripe_session_id);
    }
  }

  ngOnInit(): void {
    let self = this;
    // setTimeout(function() {
    //   self.getTasks();
    // }, 200);

    self.getTasks();
    // this.dashboardDataSync = setInterval(function() {
    //   self.getInfo(false);
    // }, 10000);
  }

  ngOnDestroy(): void {
    // clearInterval(this.dashboardDataSync);
  }

  getTasks() {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.get("tasks/running").subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      if (!res.error) {
        self.tasksData = res.data;
      }
      self.getTeams();
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  getTeams() {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.get("teams/all").subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      if (!res.error) {
        self.teamsData = res.data;
      }
      self.getInfo();
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  getInfo(flag = true) {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.post("dashboard/data", this.dashboardAnalyticsForm.value).subscribe(async function(res:any){
      self.httpClientService.showLoader = false;
      if (!res.error) {
        self.totalTeams = res.data.totalTeams;
        self.totalTasks = res.data.totalTasks;
        self.totalPendingTasks = res.data.totalPendingTasks;
        self.totalCompletedTasks = res.data.totalCompletedTasks;
        self.totalUnassignedTasks = res.data.totalUnassignedTasks;
        self.totalTeamUsers = res.data.totalTeamUsers;
        self.average_time = self.httpClientService.getAverageTime(res.data.average_time);
      }
      else {
        self.httpClientService.showLoader = false;
      }
      if(flag) self.dashboardCompletedRecordBusinessUser();
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  dashboardCompletedRecordBusinessUser(flag=true) {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.post("tasks/business/dashboardcompleted", this.dashboardChartForm.value).subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      self.calculateDataForGraph(res.data.completed_record);
      self.setTeamManagerChartGraph(res.data.team_chart);
      if(flag) self.dashboardBurndownChartBusinessUser();
      if (!res.error) {
        
      }
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  setTeamManagerChartGraph(graphData) {
    // Team User Chart
    if(this.teamUserJobsChart) this.teamUserJobsChart.destroy();
    console.log("this.teamUserJobsChart", this.teamUserJobsChart);
    var teamUserJobs:any = document.getElementById('teamUserJobs');
    var teamUserJobsctx = teamUserJobs.getContext('2d');
    this.teamUserJobsChart = new Chart(teamUserJobsctx, {
      type: 'bar',
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
          labels: graphData.labels,
          datasets: [
            {
              label: 'Total Completed',
              data: graphData.data,
              fill: false,
              lineTension: 0,
              borderWidth: 2,
              borderColor: 'rgba(43, 84, 163, 1)',
              backgroundColor: 'rgba(43, 84, 163, 1)'
            }
          ]
      }
    });
  }

  dashboardBurndownChartBusinessUser() {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.post("tasks/business/burndownchart", this.dashboardBurnDownForm.value).subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      self.setBurnDownChartGraphData(res.data);
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
    if(this.completedEachDayChart) this.completedEachDayChart.destroy();
    var completedEachDay:any = document.getElementById('completedEachDay');
    var completedEachDayctx = completedEachDay.getContext('2d');
    this.completedEachDayChart = new Chart(completedEachDayctx, {
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
    if(this.cumulativeJobCompletedChart) this.cumulativeJobCompletedChart.destroy();
    var cumulativeJobCompleted:any = document.getElementById('cumulativeJobCompleted');
    var cumulativeJobCompletedctx = cumulativeJobCompleted.getContext('2d');
    this.cumulativeJobCompletedChart = new Chart(cumulativeJobCompletedctx, {
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
          labels: actualGraphData.cumulativeJobCompleted.labels,
          datasets: [{
              label: 'Completed records',
              data: actualGraphData.cumulativeJobCompleted.data,
              fill: false,
              lineTension: 0,
              borderWidth: 2,
              borderColor: 'rgba(43, 84, 163, 1)'
          }]
      }
    });

    // Total Jobs Outstanding
    if(this.outstandingJobsChart) this.outstandingJobsChart.destroy();
    var outstandingJobs:any = document.getElementById('outstandingJobs');
    var outstandingJobsctx = outstandingJobs.getContext('2d');
    this.outstandingJobsChart = new Chart(outstandingJobsctx, {
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

  setBurnDownChartGraphData(actualGraphData) {
    // Burn Down Chart
    if(this.burnDownChart) this.burnDownChart.destroy();
    var burnDownChart:any = document.getElementById('burnDownChart');
    var burnDownChartctx = burnDownChart.getContext('2d');
    var datasets = [];
    for (var i = 0; i < actualGraphData.datasets.length; ++i) {
      datasets.push({
        label: actualGraphData.datasets[i].label,
        data: actualGraphData.datasets[i].data,
        fill: false,
        lineTension: 0,
        borderWidth: 2,
        borderColor: actualGraphData.datasets[i].borderColor
      });
    }
    this.burnDownChart = new Chart(burnDownChartctx, {
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
          labels: actualGraphData.labels,
          datasets: datasets
      }
    });
  }

  subscriptionAddCheckout(stripe_session_id) {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.post("user-subscriptions/addcheckout", {stripe_session_id: stripe_session_id}).subscribe(function(res:any){
      self.httpClientService.showLoader = false;
      if (!res.error) {
        self.httpClientService.showSuccess("Subscription successfully added in your account.");
        self.httpClientService.goTo("dashboard");
      }
      else {
        self.httpClientService.showError(res.message);
      }
    }
    , error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

  

}
