import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { PaginationClass } from 'src/app/services/PaginationClass';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'moment';
@Component({
	selector: 'app-taskview',
	templateUrl: './taskview.component.html',
	styleUrls: ['./taskview.component.css']
})
export class BusinessTaskviewComponent extends PaginationClass implements OnInit {
	public task_id: string;
	public taskData: any;
	public taskUsersData: any = [];
	public searchKeyword: string = "";
	public currentCount: number = 0;
	public perPageLimit: number = 50;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		super();
		this.task_id = route.snapshot.params.id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks();
			
		}, 200);
	}

	getTaskUsers() {
		var self = this;
		this.httpClientService.post("tasks/users", {task_id: this.task_id}).subscribe(function (res: any) {
			console.log(res.data)
			if (!res.error) {
				self.taskUsersData = res.data;
			}
		}
		, error => {
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

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
			this.httpClientService.get("tasks/view/" + this.task_id + this.pageUrl + "&q=" + this.searchKeyword + "&perPage=" + this.perPageLimit).subscribe(function (res: any) {
				self.httpClientService.showLoader = false;
				console.log(res.data)
				self.setPagination({ count: res.data.task_details.count, perPage: res.data.task_details.perPage });
				if (!res.error) {
					self.taskData = res.data;
					self.currentCount = res.data.task_details.result.length;
					self.getTaskUsers();
				}
				else {
					self.currentCount = 0;
					self.httpClientService.showError(res.message);
				}
			}
				, error => {
					self.httpClientService.showLoader = false;
					self.httpClientService.showError(self.httpClientService.errorMessage);
				});
	}

	onTaskUpdate(e, task_data, index){
		task_data.task_modified_data[index] = e.target.value;
		var self = this;
		this.httpClientService.post("tasks/data/update", task_data).subscribe(function(res:any){
			if (!res.error) {
				// self.httpClientService.showSuccess(res.message);
				// self.httpClientService.goTo("tasks");
			}
			else {
				self.httpClientService.showError(res.message);
			}
		}
		, error => {
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

	onUserChange(event, task_detail_id, index) {
		var user_id = event.target.value;
		console.log("user_id", user_id);
		var self = this;
		var requestData = {
			task_detail_id: task_detail_id,
			user_id: user_id
		};
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/reassign", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			console.log("res", res);
			if (!res.error) {
				self.httpClientService.showSuccess(res.message);
				if (user_id) {
					self.taskData.task_details.result[index].task_status = "assigned";
				}
				else {
					self.taskData.task_details.result[index].task_status = "unassigned";
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

	exportData(type) {
		var self = this;
		var requestData = {
			task_id: this.task_id
		};
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/export/"+type, requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			console.log("res", res);
			if (!res.error) {
				window.location.href = res.data;
				// self.httpClientService.showSuccess(res.message);
				// self.httpClientService.goTo("tasks");
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
