import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setcompletedate',
  templateUrl: './setcompletedate.component.html',
  styleUrls: ['./setcompletedate.component.css']
})
export class SetcompletedateComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public taskStepData:any;
	public min_date = new Date();
	public end_date:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchStartDateStep();
			});
		}, 500);
	}

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
			}
			else {
				self.httpClientService.showError(taskRes.message);
			}
			if(cb) cb();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchStartDateStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "start_date"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				if (self.taskStepData.boolean_question) {
					self.min_date = self.taskStepData.data;
					self.fetchTaskStep();
				}
				else {
					self.httpClientService.goTo("tasks/setstartdate/"+self.task_id);
				}
			}
			else {
				self.httpClientService.goTo("tasks/setstartdate/"+self.task_id);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "end_date"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				if (self.taskStepData.boolean_question) {
					self.end_date = self.taskStepData.data;
				}
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	saveCompleteDate(type) {
		console.log(this.end_date);
		var taskStepRequestData = {
			task_id: this.task_id,
			boolean_question: type,
			type: "end_date",
			data: type ? this.end_date: null,
			step_complete: true
		};
		this.saveTaskStep(taskStepRequestData);
		
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				var goTo = "tasks/userassignmentpolicy/"+self.task_id;
				if (!taskStepRequestData.boolean_question) {
					goTo = "tasks/jobsummary/"+self.task_id;
				}
				self.httpClientService.goTo(goTo);
			}
			else {
				self.httpClientService.showError(saveTaskStepRes.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

}
