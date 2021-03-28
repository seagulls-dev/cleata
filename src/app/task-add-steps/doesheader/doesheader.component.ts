import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doesheader',
  templateUrl: './doesheader.component.html',
  styleUrls: ['./doesheader.component.css']
})
export class DoesheaderComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public taskStepData:any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(); 
		}, 200);
	}

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData = res.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
				self.fetchTaskStep();
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

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "does_header"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskStepData = res.data;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	gotoYes() {
		var goTo = "tasks/assigndatatype/"+this.task_id;
		var taskStepRequestData = {
			task_id: this.task_id,
			type: "does_header",
			boolean_question: true,
			data: [],
			step_complete: true
		}
		var missingHeader = false;
		for (var i = 0; i < this.total_columns_array.length; ++i) {
			if (typeof this.taskData.task_details.result[0].task_modified_data[i] == "undefined" || !this.taskData.task_details.result[0].task_modified_data[i]) {
				missingHeader = true;
			}
		}
		if (missingHeader) {
			goTo = "tasks/assignheader/"+this.task_id;
			if (this.taskStepData) {
				if (this.taskStepData.boolean_question) {
					taskStepRequestData.data = this.taskStepData.data;
					taskStepRequestData.step_complete = this.taskStepData.step_complete;
				}
				else {
					taskStepRequestData.step_complete = false;
				}
			}
			else {
				taskStepRequestData.step_complete = false;
			}

			alert("We found 1 or more header column(s) are blank. So you need to fill thease column(s).");
		}
		if (!taskStepRequestData.data.length) {

			for (var i = 0; i < this.total_columns_array.length; ++i) {
				if (this.taskData.task_details.result[0].task_modified_data[i]) {
					taskStepRequestData.data.push({
						column_name: this.taskData.task_details.result[0].task_modified_data[i]
					});
				}
				else {
					taskStepRequestData.data.push({
						column_name: ""
					});
				}
			}
		}
		this.saveTaskStep(taskStepRequestData, goTo);
	}

	gotoNo() {
		var goTo = "tasks/assignheader/"+this.task_id;
		var taskStepRequestData = {
			task_id: this.task_id,
			type: "does_header",
			boolean_question: false,
			data: null,
			step_complete: false
		}
		if (this.taskStepData) {
			if (this.taskStepData.boolean_question) {
				taskStepRequestData.data = null;
				taskStepRequestData.step_complete = false;
			}
			else {
				taskStepRequestData.data = this.taskStepData.data;
				taskStepRequestData.step_complete = this.taskStepData.step_complete;
			}
		}
		this.saveTaskStep(taskStepRequestData, goTo);
	}

	saveTaskStep(taskStepRequestData, goTo) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.httpClientService.goTo(goTo);
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