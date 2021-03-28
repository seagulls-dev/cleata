import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { BaseClass } from '../../services/BaseClass';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-taskadd',
  templateUrl: './taskadd.component.html',
  styleUrls: ['./taskadd.component.css']
})
export class TaskaddComponent extends BaseClass implements OnInit {
	submitted:boolean = false;
	taskForm: FormGroup;
  constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
    super();
		this.taskForm = fb.group({
			title: ["", [Validators.required, Validators.maxLength(50)]],
			// user_ids: [[]],
			description: ["", [Validators.required, Validators.maxLength(1000)]],
      status: [true, [Validators.required]],
      profile_picture: [''],
	    });
	}

	ngOnInit(): void {
		console.log('hello');
    // let self = this;
    var fileUploadDataObject = {
      url: this.httpClientService.serviceBase + 'fileupload',
      itemAlias: "profile_picture"
    };
    this.uploader = new FileUploader(fileUploadDataObject);
    this.uploadNow(this.uploader, this.httpClientService, ["xlsx", "csv"]);
  }

  onSuccessFunction(response) {
    this.taskForm.patchValue({
      profile_picture: response.data
    })
    console.log(response.data); // this gives filename after successful upload
}
  
  get f() { return this.taskForm.controls; }

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
					self.httpClientService.goTo("tasks");
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
