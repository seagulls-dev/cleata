import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-assignheader',
  templateUrl: './assignheader.component.html',
  styleUrls: ['./assignheader.component.css']
})
export class AssignheaderComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public assignHeaderForm: FormGroup;
	public taskStepData:any;
	submitted:boolean = false;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.task_id = route.snapshot.params.task_id;
		this.assignHeaderForm = fb.group({
			column_data: this.fb.array([]),
	    });
	}

	get f() { return this.assignHeaderForm.controls; }
	get t() { return this.f.column_data as FormArray; }

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
			self.assignHeaderColumnInputs();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	assignHeaderColumnInputs() {
		for (var i = 0; i < this.total_columns_array.length; ++i) {
			this.t.push(this.fb.group({
				column_name: [(this.taskStepData && this.taskStepData.data ? this.taskStepData.data[i].column_name : ""), [Validators.required]]
			}));
		}
	}

	saveAssignHeader() {
		this.submitted = true;
		if (this.assignHeaderForm.valid) {
			var goTo = "tasks/assigndatatype/"+this.task_id;
			var taskStepRequestData = {
				task_id: this.task_id,
				type: "does_header",
				data: this.assignHeaderForm.value.column_data,
				step_complete: true
			};
			this.saveTaskStep(taskStepRequestData, goTo);
		}
		else {
			this.httpClientService.showError("Please fill all header column's name");
		}
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
