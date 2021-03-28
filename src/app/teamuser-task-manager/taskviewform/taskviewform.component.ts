import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginationClass } from 'src/app/services/PaginationClass';
import * as moment from 'moment';

@Component({
  selector: 'app-taskviewform',
  templateUrl: './taskviewform.component.html',
  styleUrls: ['./taskviewform.component.css']
})
export class TaskviewformComponent extends PaginationClass implements OnInit {
	submitted:boolean = false;
	public taskDetailForm: FormGroup;
	public task_id:string;
	public taskData:any;
	public searchKeyword: string = "";
	public taskUsersData: any = [];
	public formChanges:boolean = true;
	constructor(public httpClientService: HttpClientService, public fb: FormBuilder, private route: ActivatedRoute) {
		super();
		this.task_id = route.snapshot.params.id;
		this.taskDetailForm = fb.group({
			task_status: ["", [Validators.required]],
			task_modified_data: this.fb.array([])
	    });
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTaskDetail();
		}, 200);
	}

	onChangeForm(fun) {
		console.log("fun", fun)
		if (this.formChanges) {
			if(confirm("Are you sure?")) {
				fun.apply();
			}
		}
		else {
			fun();
		}
	}

	getTaskUsers() {
		var self = this;
		this.httpClientService.post("tasks/usersteam", {task_id: this.task_id}).subscribe(function (res: any) {
			if (!res.error) {
				self.taskUsersData = res.data;
			}
		}
		, error => {
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	onUserChange(event) {
		if (!confirm("Are you sure you want to reassign this task?")) {
			event.target.value = "";
			return false;
		}
		var user_id = event.target.value;
		var self = this;
		var requestData = {
			task_detail_id: self.taskData.task_details.result[0]._id,
			user_id: user_id
		};
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/reassign", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.httpClientService.showSuccess(res.message);
				self.gotoPage(self.activePage);
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

	viewPage(event) {
		var value = Number(event.target.value) ? parseInt(event.target.value) : "";
		if (value) {
			this.gotoPage(value);
		}
		else {
			this.httpClientService.showError("Please enter valid value");
		}
		console.log("event", event);
		
		
	}

	searchByKeyword() {
		this.activePage = 1;
		this.gotoFirst();
	}

	hitApi() {
		this.getTaskDetail();
	}

	get f() { return this.taskDetailForm.controls; }
	get t() { return this.f.task_modified_data as FormArray; }

	getTaskDetail() {
		var self = this;
		this.taskDetailForm.reset();
		this.t.clear();
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasksOfTeam/view/" + this.task_id + this.pageUrl + "&q=" + this.searchKeyword + "&perPage=1").subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (res.data.task_details) {
				self.setPagination({ count: res.data.task_details.count, perPage: res.data.task_details.perPage });
			}
			else {
				self.setPagination({ count: 0, perPage: 1 });
			}
			if (!res.error) {
				// if (res.data.task_details.result[0].task_status == "assigned") {
					self.taskData = res.data;
					if (self.taskData.task_details) {
						self.taskDetailForm.patchValue({
							task_status: self.taskData.task_details.result[0].task_status
						});
						for (var i = 0; i < self.taskData.task_details.result[0].task_modified_data.length; ++i) {
							self.t.push(self.fb.group({
								value_data: [self.setDataAccording(self.taskData.task_details.result[0].task_modified_data[i])]
							}));
						}
						self.getTaskUsers();
					}
					
				// }
				// else if(res.data.task_details.result[0].task_status == "completed") {
				// 	self.httpClientService.showError("Task already completed");
				// }
				// console.log("taskData", self.taskData);
				// console.log("taskDetailForm", self.taskDetailForm);
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

	setDataAccording(data) {
		var converted_date_value = moment(data).format(this.httpClientService.excelDateFormat);
		if (typeof data == "string" && converted_date_value != "Invalid date") {
			data = converted_date_value;
		}
		return data;
	}

	updateCompleteTaskDetail() {
		this.taskDetailForm.patchValue({
			task_status: "completed"
		});
		this.updateTaskDetail();
	}

	updateTaskDetail(complete=false) {
		var self = this;
		var comfirmMsg = "Are you sure you want to save this task?";
		if (complete) {
			comfirmMsg = "Are you sure you want to save and complete this task?";
		}
		if (!confirm(comfirmMsg)) {
			return false;
		}
		if (complete) {
			this.taskDetailForm.patchValue({
				task_status: "completed"
			});
		}
		this.submitted = true;
		console.log("this.taskDetailForm", this.taskDetailForm);
		if (this.taskDetailForm.valid) {
			var sendRequestData = {
				_id: this.taskData.task_details.result[0]._id,
				task_modified_data: [],
				task_status: this.taskDetailForm.value.task_status,
			}
			for (var i = 0; i < this.taskData.task_details.result[0].task_modified_data.length; ++i) {
				if (this.taskData.task_permissions.permissions[i]=='EDIT') {
					sendRequestData.task_modified_data.push(this.taskDetailForm.value.task_modified_data[i].value_data);
				}
				else {
					sendRequestData.task_modified_data.push(this.taskData.task_details.result[0].task_modified_data[i]);
				}
			}
			console.log("sendRequestData", sendRequestData);
			this.httpClientService.showLoader = true;
			this.httpClientService.post("tasks/data/update", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					if (self.activePage < self.count) {
						self.gotoNext();
					}
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

	cancelForm() {
		location.reload();
	}
}
