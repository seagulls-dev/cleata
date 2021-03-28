import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { PaginationClass } from '../../services/PaginationClass';

@Component({
  selector: 'app-uncategorizedtasklist',
  templateUrl: './uncategorizedtasklist.component.html',
  styleUrls: ['./uncategorizedtasklist.component.css']
})
export class UncategorizedtasklistComponent extends PaginationClass implements OnInit {
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
		this.httpClientService.get("uncategorizedtasks" + this.pageUrl + "&q=" + this.searchKeyword).subscribe(function (res: any) {
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

}
