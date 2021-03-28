import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-jobsummary',
  templateUrl: './jobsummary.component.html',
  styleUrls: ['./jobsummary.component.css']
})
export class JobsummaryComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public taskStepsData:any;
	public does_header:any;
	public assign_datatype:any;
	public teams_manage:any;
	public conflict_permission:any;
	public reallocate_task:any;
	public business_rules:any;
	public uncategorized_result_divide:any;
	public start_date:any;
	public end_date:any;
	public assignment_policy:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchTaskStep();
			});
		}, 500);
	}

	ngOnDestroy(): void {
		$("#limitExceedModal").modal('hide');
	}

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				cb();
			}
			else {
				self.httpClientService.showError(taskRes.message);
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
			task_id: this.task_id
		}
		this.httpClientService.post("tasks/fetchtaskstep/all", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepsData = taskStepRes.data;
				if (self.taskStepsData.length) {
					self.does_header = self.taskStepsData.find(o => o.type === "does_header");
					self.assign_datatype = self.taskStepsData.find(o => o.type === "assign_datatype");
					self.teams_manage = self.taskStepsData.find(o => o.type === "teams_manage");
					self.conflict_permission = self.taskStepsData.find(o => o.type === "conflict_permission");
					self.reallocate_task = self.taskStepsData.find(o => o.type === "reallocate_task");
					self.business_rules = self.taskStepsData.find(o => o.type === "business_rules");
					self.uncategorized_result_divide = self.taskStepsData.find(o => o.type === "uncategorized_result_divide");
					self.start_date = self.taskStepsData.find(o => o.type === "start_date");
					self.end_date = self.taskStepsData.find(o => o.type === "end_date");
					self.assignment_policy = self.taskStepsData.find(o => o.type === "assignment_policy");
				}
			}
			else {
				self.httpClientService.goTo("tasks/doesheader/"+self.task_id);
			}
			
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	submitDataFile() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id
		}
		this.httpClientService.post("tasks/processdatafile", requestData).subscribe(function (processData: any) {
			self.httpClientService.showLoader = false;
			if (!processData.error) {
				self.httpClientService.goTo("business-user/tasks");
			}
			else {
				if (processData.data && processData.data == 1) {
					$("#limitExceedMessage").text(processData.message);
					$("#limitExceedModal").modal('show');
				}
				else if (processData.data && processData.data == 2) {
					self.httpClientService.goTo("tasks/limitexceeded/"+self.task_id);
				}
				else {
					self.httpClientService.showError(processData.message);
				}
			}
			
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

}
