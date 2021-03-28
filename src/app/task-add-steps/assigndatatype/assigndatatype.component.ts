import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PaginationClass } from 'src/app/services/PaginationClass';

@Component({
  selector: 'app-assigndatatype',
  templateUrl: './assigndatatype.component.html',
  styleUrls: ['./assigndatatype.component.css']
})
export class AssigndatatypeComponent extends PaginationClass implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public assignDataTypeForm: FormGroup;
	public taskStepData:any;
	submitted:boolean = false;
	public taskHeaderStepData:any;

	public searchKeyword: string = "";
	public currentCount: number = 0;
	public perPageLimit: number = 50;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, public fb: FormBuilder) {
		super();
		this.task_id = route.snapshot.params.task_id;
		this.assignDataTypeForm = fb.group({
			datatype_data: this.fb.array([]),
	    });
	}

	get f() { return this.assignDataTypeForm.controls; }
	get t() { return this.f.datatype_data as FormArray; }

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.fetchTaskHeaderStep();
			
		}, 500);
	}

	fetchTaskHeaderStep(cb=null) {
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
				if (self.taskHeaderStepData.step_complete && self.taskHeaderStepData.data.length) {
					for (var i = 0; i < self.taskHeaderStepData.data.length; ++i) {
						self.t.push(self.fb.group({
							datatype_name: [(self.taskStepData && self.taskStepData.data ? self.taskStepData.data[i].datatype_name : "string"), [Validators.required]]
						}));
					}
					self.getTasks(true);
				}
				else {
					self.httpClientService.goTo("tasks/doesheader/"+self.task_id);
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

	searchByKeyword() {
		this.activePage = 1;
		this.gotoFirst();
	}

	onPageLimitChange(e){
		this.perPageLimit = e.target.value;
		this.activePage = 1;
		this.gotoFirst();
	}

	hitApi() {
		this.getTasks();
	}

	getTasks(first=false) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + this.pageUrl + "&q=" + this.searchKeyword + "&perPage=" + this.perPageLimit).subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			self.setPagination({ count: taskRes.data.task_details.count, perPage: taskRes.data.task_details.perPage });
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
				if (!self.searchKeyword && self.taskHeaderStepData.boolean_question && self.activePage == 1) {
					self.taskData.task_details.result.splice(0, 1);
				}
				if (first) {
					self.fetchTaskStep();
				}
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
		// this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "assign_datatype"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			// self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				for (var i = 0; i < self.taskHeaderStepData.data.length; ++i) {
					self.t.controls[i].patchValue({
						datatype_name: self.taskStepData.data[i].datatype_name
					});
					// self.t.push(self.fb.group({
					// 	datatype_name: [self.taskStepData.data[i].datatype_name, [Validators.required]]
					// }));
				}
			}
			
		}
		, error => {
			// self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	assignDataTypeColumnInputs() {
		for (var i = 0; i < this.taskHeaderStepData.data.length; ++i) {
			this.t.push(this.fb.group({
				datatype_name: [(this.taskStepData && this.taskStepData.data ? this.taskStepData.data[i].datatype_name : "string"), [Validators.required]]
			}));
		}
	}

	saveAssignDataType() {
		this.submitted = true;
		if (this.assignDataTypeForm.valid) {
			
			var taskStepRequestData = {
				task_id: this.task_id,
				type: "assign_datatype",
				data: this.assignDataTypeForm.value.datatype_data,
				step_complete: true
			};
			this.saveTaskStep(taskStepRequestData);
		}
		else {
			this.httpClientService.showError("Please select all header's datatypes");
		}
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				var goTo = "tasks/allocateteam/"+self.task_id;
				if (saveTaskStepRes.data.isDataTypeMissmatch) {
					var goTo = "tasks/missmatchdatatype/"+self.task_id;
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
