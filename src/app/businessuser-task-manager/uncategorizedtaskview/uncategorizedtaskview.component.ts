import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { PaginationClass } from 'src/app/services/PaginationClass';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-uncategorizedtaskview',
  templateUrl: './uncategorizedtaskview.component.html',
  styleUrls: ['./uncategorizedtaskview.component.css']
})
export class UncategorizedtaskviewComponent extends PaginationClass implements OnInit {
	public task_id: string;
	public taskData: any;
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

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("uncategorizedtasks/view/" + this.task_id + this.pageUrl + "&q=" + this.searchKeyword + "&perPage=" + this.perPageLimit).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			self.setPagination({ count: res.data.task_details.count, perPage: res.data.task_details.perPage });
			if (!res.error) {
				self.taskData = res.data;
				self.currentCount = res.data.task_details.result.length;
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

	setDataAccording(data) {
		var converted_date_value = moment(data).format(this.httpClientService.excelDateFormat);
		if (typeof data == "string" && converted_date_value != "Invalid date") {
			data = converted_date_value;
		}
		return data;
	}

	exportData(type) {
		var self = this;
		var requestData = {
			task_id: this.task_id
		};
		this.httpClientService.showLoader = true;
		this.httpClientService.post("uncategorizedtasks/export/"+type, requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
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
