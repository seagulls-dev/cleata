import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviewmatchingdata',
  templateUrl: './reviewmatchingdata.component.html',
  styleUrls: ['./reviewmatchingdata.component.css']
})
export class ReviewmatchingdataComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	// public total_columns_array:any = [];
	public matchingdataanalytics:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks();
		}, 500);
	}

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				// self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
			}
			else {
				self.httpClientService.showError(taskRes.message);
			}
			self.matchingDataAnalytics();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	matchingDataAnalytics() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id
		}
		this.httpClientService.post("tasks/matchingdataanalytics", requestData).subscribe(function (matchingdataanalytics: any) {
			self.httpClientService.showLoader = false;
			if (!matchingdataanalytics.error) {
				self.matchingdataanalytics = matchingdataanalytics.data;
			}
			else {
				self.httpClientService.goTo("tasks/wantconfigurebusinessrules/"+self.task_id);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	goToNext() {
		if (this.matchingdataanalytics && !this.matchingdataanalytics.tota_unmatch_rows) {
			this.httpClientService.goTo("tasks/setstartdate/"+this.task_id);
		}
		else {
			this.httpClientService.goTo("tasks/uncategorizedresulttoteams/"+this.task_id);
		}
	}

}
