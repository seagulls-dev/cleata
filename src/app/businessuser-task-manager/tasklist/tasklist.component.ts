import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { PaginationClass } from '../../services/PaginationClass';

@Component({
	selector: 'app-tasklist',
	templateUrl: './tasklist.component.html',
	styleUrls: ['./tasklist.component.css']
})
export class BusinessTasklistComponent extends PaginationClass implements OnInit {
	public tasksData: any;
	public searchKeyword: string = "";
	public currentCount: number = 0;
	constructor(public httpClientService: HttpClientService) {
		super();
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

	hitApi() {
		this.getTasks();
	}

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks" + this.pageUrl + "&q=" + this.searchKeyword).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			self.setPagination({ count: res.data.count, perPage: res.data.perPage });
			// console.log("res", res.data.result);
			if (!res.error) {
				self.tasksData = res.data.result;
				self.currentCount = res.data.count;
			}
			else {
				self.currentCount = 0;
				self.tasksData = null;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	updateUnuncategorizedType(event, index) {
		var self = this;
		if (!confirm("You can't revert back after you confirm. Are you sure?")) {
			return false;
		}
		var requestData = {
			task_id: this.tasksData[index]._id,
			uncategorized_type: event.target.value
		}
		this.httpClientService.showLoader = true;
		console.log("requestData", requestData);
		this.httpClientService.post("tasks/updateuncategorizedtype", requestData).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.tasksData[index].uncategorized_type = requestData.uncategorized_type;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
		
	}

}
