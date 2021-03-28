import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { PaginationClass } from '../../services/PaginationClass';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-tasklist',
	templateUrl: './tasklist.component.html',
	styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent extends PaginationClass implements OnInit {
	public tasksData: any;
	public searchKeyword: string = "";
	public currentCount: number = 0;
	isLoggedIn$: Observable<object>;
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
			this.httpClientService.get("tasksOfTeam" + this.pageUrl + "&q=" + this.searchKeyword).subscribe(function (res: any) {
				self.httpClientService.showLoader = false;
				console.log(res.data)
				self.setPagination({ count: res.data.count, perPage: res.data.perPage });
				if (!res.error) {
					self.tasksData = res.data;
					self.currentCount = res.data.length;
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
