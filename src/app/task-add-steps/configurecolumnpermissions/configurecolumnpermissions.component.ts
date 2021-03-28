import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configurecolumnpermissions',
  templateUrl: './configurecolumnpermissions.component.html',
  styleUrls: ['./configurecolumnpermissions.component.css']
})
export class ConfigurecolumnpermissionsComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public taskStepData:any;
	public taskHeaderStepData:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchTaskHeaderStep();
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

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "teams_manage"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				for (var i = 0; i < self.taskStepData.data.teams.length; ++i) {
					if (!self.taskStepData.data.teams[i].permissions || !self.taskStepData.data.teams[i].permissions.length) {
						Object.assign(self.taskStepData.data.teams[i], {permissions: []});
	            		for(var j=0; j<self.taskHeaderStepData.data.length; j++){
			              self.taskStepData.data.teams[i].permissions.push('EDIT')
			            }
					}
				}
				console.log("self.taskStepData", self.taskStepData);
			}
			else {
				self.httpClientService.goTo("tasks/allocateteam/"+self.task_id);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchTaskHeaderStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "does_header"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskHeaderStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskHeaderStepRes.error) {
				self.taskHeaderStepData = taskHeaderStepRes.data;
				if (!self.taskHeaderStepData.step_complete || !self.taskHeaderStepData.data.length) {
					self.httpClientService.goTo("tasks/doesheader/"+self.task_id);
				}
				else {
					self.fetchTaskStep();
				}
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	saveColumnPermissions() {
		var taskStepRequestData = {
			task_id: this.task_id,
			type: "teams_manage",
			data: this.taskStepData.data,
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
				// var goTo = "tasks/allocateteam/"+self.task_id;
				// if (saveTaskStepRes.data.isDataTypeMissmatch) {
				// 	var goTo = "tasks/missmatchdatatype/"+self.task_id;
				// }
				self.httpClientService.goTo("tasks/conflictcolumnpermissions/"+self.task_id);
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
