import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseClass } from '../../services/BaseClass';
import { FileUploader } from 'ng2-file-upload';
declare var $: any;
@Component({
  selector: 'app-taskadd',
  templateUrl: './taskadd.component.html',
  styleUrls: ['./taskadd.component.css']
})
export class BusinessTaskaddComponent extends BaseClass implements OnInit {
	submitted:boolean = false;
	taskForm: FormGroup;
  	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
    super();
		this.taskForm = fb.group({
			// title: ["", [Validators.required, Validators.maxLength(50)]],
			// user_ids: [[]],
			// description: ["", [Validators.required, Validators.maxLength(1000)]],
			// status: [true, [Validators.required]],
			profile_picture: ['', Validators.required],
	    });
	}

	ngOnInit(): void {
		// let self = this;
		var fileUploadDataObject = {
			url: this.httpClientService.serviceBase + 'fileupload',
			itemAlias: "profile_picture"
		};
		this.uploader = new FileUploader(fileUploadDataObject);
		this.uploadNow(this.uploader, this.httpClientService, ["xls", "xlsx", "csv"],{showLoader:false, showMessage: false});
	}

	ngOnDestroy(): void {
		$("#limitExceedModal").modal('hide');
	}

  	onSuccessFunction(response) {
	    this.taskForm.patchValue({
	    	profile_picture: response.data
    	});
    	this.saveTask();
    	console.log(response.data); // this gives filename after successful upload
	}
  
  	get f() { return this.taskForm.controls; }

  	saveTask() {
		var self = this;
		this.submitted = true;
		if (this.taskForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.taskForm.value;
			this.httpClientService.post("tasks/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				console.log('hi');
				if (!res.error) {
					// self.httpClientService.showSuccess(res.message);
					let id = res.data._id;
					if (res.limitExceed) {
						self.httpClientService.goTo('tasks/limitexceeded/'+id);
					}
					else {
						// window.location.href = "#/tasks/doesheader/"+id;
						self.httpClientService.goTo("tasks/doesheader/"+id);
					}
					// self.httpClientService.goTo('tasks/limitexceeded/'+id);
					// if(confirm("Does this include header?")) {
						// self.updateTaskHeader(res.data._id)
					 //  }else{
						// self.httpClientService.goTo('business-user/tasks-header/edit/'+id);
					 //  }
				}
				else {
					// if (res.data) {
						// $("#limitExceedMessage").text(res.message);
						// $("#limitExceedModal").modal('show');
						self.httpClientService.goTo('tasks/limitexceeded/'+res.data._id);
					// }
					// else {
					// 	self.httpClientService.showError(res.message);
					// }
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			});
		}
	}

	updateTaskHeader(task_id){
		var self = this;
		this.httpClientService.get("taskdetails/delete/" + task_id).subscribe(function(res:any){
			if (!res.error) {
				// self.httpClientService.showSuccess(res.message);
				self.httpClientService.goTo('jobs/rule/'+task_id);
			}
			else {
				self.httpClientService.showError(res.message);
			}
		}
		, error => {
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

}
