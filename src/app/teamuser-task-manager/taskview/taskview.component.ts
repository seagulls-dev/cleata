import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { PaginationClass } from 'src/app/services/PaginationClass';
import * as moment from 'moment';
@Component({
	selector: 'app-taskview',
	templateUrl: './taskview.component.html',
	styleUrls: ['./taskview.component.css']
})
export class TaskviewComponent extends PaginationClass implements OnInit {
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

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
			this.httpClientService.get("tasksOfTeam/view/" + this.task_id + this.pageUrl + "&q=" + this.searchKeyword + "&perPage=" + this.perPageLimit).subscribe(function (res: any) {
				self.httpClientService.showLoader = false;
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
		if(e !== null && index !== null){
			task_data.task_modified_data[index] = e.target.value;
		}else if(e == 'completed'){
			if (!confirm("Are you sure you want to complete this task?")) {
				return false;
			}
			this.httpClientService.showLoader = true;
			task_data.task_status = e;
		}
		var self = this;
		this.httpClientService.post("tasks/data/update", task_data).subscribe(function(res:any){
			if(e == 'completed'){
				self.httpClientService.showLoader = false;
			}
			if (!res.error) {
				if(e == 'completed'){
					self.httpClientService.showSuccess("Task completed successfully.");
				}
			}
			else {
				if(e == 'completed'){
					task_data.task_status = "assigned";
				}
				self.httpClientService.showError(res.message);
			}
		}
		, error => {
			if(e == 'completed'){
				self.httpClientService.showLoader = false;
				task_data.task_status = "assigned";
			}
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	   }

	   updateTaskStatus(task_data){

	   }

	setDataAccording(data) {
		var converted_date_value = moment(data).format(this.httpClientService.excelDateFormat);
		if (typeof data == "string" && converted_date_value != "Invalid date") {
			data = converted_date_value;
		}
		return data;
	}

	onUserChange(event, task_detail_id, index) {
		if (!confirm("Are you sure you want to reassign this task?")) {
			event.target.value = "";
			return false;
		}
		var user_id = event.target.value;
		var self = this;
		var requestData = {
			task_detail_id: task_detail_id,
			user_id: user_id
		};
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/reassign", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData.task_details.result.splice(index, 1);
				// window.location.href = res.data;
				self.httpClientService.showSuccess(res.message);
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

	rejectTask(index) {
		if (confirm("Are you sure you want to reject this task?")) {
			var self = this;
			var requestData = {
				task_detail_id: this.taskData.task_details.result[index]._id
			};
			this.httpClientService.showLoader = true;
			this.httpClientService.post("tasks/rejectTeamUser", requestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.taskData.task_details.result.splice(index, 1);
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

}
