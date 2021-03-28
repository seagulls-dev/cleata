import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-userassignmentpolicy',
  templateUrl: './userassignmentpolicy.component.html',
  styleUrls: ['./userassignmentpolicy.component.css']
})
export class UserassignmentpolicyComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public assignmentPolicyForm: FormGroup;
	public taskStepData:any;
	submitted:boolean = false;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, public fb: FormBuilder) {
		this.task_id = route.snapshot.params.task_id;
		this.assignmentPolicyForm = fb.group({
			assign_type: ["", Validators.required],
	    });
	}

	get f() { return this.assignmentPolicyForm.controls; }

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchTaskStep();
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
				if(cb) cb();
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
			task_id: this.task_id,
			type: "assignment_policy"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				self.assignmentPolicyForm.patchValue({
					assign_type: self.taskStepData.data.assign_type
				});
			}
			
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	saveAssignmentPolicyType() {
		// console.log(this.conflictPermissionForm.value);
		if (this.assignmentPolicyForm.valid) {
			var taskStepRequestData = {
				task_id: this.task_id,
				type: "assignment_policy",
				boolean_question:true,
				data: this.assignmentPolicyForm.value,
				step_complete: true
			};
			this.saveTaskStep(taskStepRequestData);
		}
		else {
			this.httpClientService.showError("Please select an option!");
		}
		
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				self.httpClientService.goTo("tasks/jobsummary/"+self.task_id);
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
