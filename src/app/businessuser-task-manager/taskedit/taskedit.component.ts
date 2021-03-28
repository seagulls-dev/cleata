import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taskedit',
  templateUrl: './taskedit.component.html',
  styleUrls: ['./taskedit.component.css']
})
export class BusinessTaskeditComponent implements OnInit {
	submitted:boolean = false;
	taskForm: FormGroup;
	public task_id:string;
	public taskData:any;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private route: ActivatedRoute) {
		this.task_id = route.snapshot.params.id;
		this.taskForm = fb.group({
			id: ["", Validators.required],
			title: ["", [Validators.required, Validators.maxLength(50)]],
			description: ["", [Validators.required, Validators.maxLength(1000)]],
			status: [false, [Validators.required]]
	    });
	}

	get f() { return this.taskForm.controls; }

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTask();
		}, 200);
	}

	getTask() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("task/view/"+this.task_id).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData = res.data;
				self.taskForm.patchValue({
					id: self.taskData.task_detail._id,
					title: self.taskData.task_detail.title,
					description: self.taskData.task_detail.description,
					status: self.taskData.task_detail.status
				});
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

	saveTask() {
		var self = this;
		this.submitted = true;
		console.log("this.taskForm", this.taskForm);
		if (this.taskForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.taskForm.value;
			this.httpClientService.post("tasks/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo('business-user/tasks');
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
