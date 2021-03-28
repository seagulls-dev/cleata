import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reportform',
  templateUrl: './reportform.component.html',
  styleUrls: ['./reportform.component.css']
})
export class ReportformComponent implements OnInit {
	submitted:boolean = false;
	reportForm: FormGroup;
	public datasets: any = [];
	public min_date = new Date();
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.reportForm = fb.group({
			file_type: ["excel", [Validators.required]],
			report_for: ["", [Validators.required]],
			report_type: ["", [Validators.required]],
			task_id: [""],
			start_date: [],
			end_date: [],
	    });
	}

	get f() { return this.reportForm.controls; }

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getAllDataset();
		}, 200);
	}

	getAllDataset() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/all").subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.datasets = res.data;
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

	getReport() {
		var self = this;
		this.submitted = true;
		console.log("this.reportForm", this.reportForm);
		if (this.reportForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.reportForm.value;
			this.httpClientService.post("tasks/exportreport", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					window.location.href = res.data;
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
