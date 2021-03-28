import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-missmatchdatatype',
  templateUrl: './missmatchdatatype.component.html',
  styleUrls: ['./missmatchdatatype.component.css']
})
export class MissmatchdatatypeComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public taskStepData:any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.task_id = route.snapshot.params.task_id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(); 
		}, 200);
	}

	getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData = res.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
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
