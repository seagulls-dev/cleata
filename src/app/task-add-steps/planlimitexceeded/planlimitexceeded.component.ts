import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planlimitexceeded',
  templateUrl: './planlimitexceeded.component.html',
  styleUrls: ['./planlimitexceeded.component.css']
})
export class PlanlimitexceededComponent implements OnInit {
	public task_id: string;
	public taskplananalytics:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTaskPlanAnalytics();
		}, 200);
	}

	deleteRecordsAfterCurrentPlan() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/deleterecordsaftercurrentplan", {task_id: this.task_id}).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.httpClientService.goTo("tasks/doesheader/"+self.task_id);
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

	getTaskPlanAnalytics() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/taskplananalytics", {task_id: this.task_id}).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskplananalytics = res.data
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
