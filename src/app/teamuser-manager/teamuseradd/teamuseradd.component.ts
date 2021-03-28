import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../../helpers/must-match.validator';
import { BaseClass } from '../../services/BaseClass';
import { FileUploader } from 'ng2-file-upload';
import { Select2OptionData } from 'ng-select2';
declare var $: any;

@Component({
  selector: 'app-teamuseradd',
  templateUrl: './teamuseradd.component.html',
  styleUrls: ['./teamuseradd.component.css']
})
export class TeamuseraddComponent extends BaseClass implements OnInit {
	submitted:boolean = false;
	teamUserForm: FormGroup;
	public teamsData: Array<Select2OptionData>;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		super();
		this.teamUserForm = fb.group({
			first_name: ["", [Validators.required, Validators.maxLength(100)]],
			last_name: ["", [Validators.required, Validators.maxLength(100)]],
			team_ids: [[]],
			mobile: ["", [customValidationService.checkLimit(1, 15)]],
			profile_picture: [""],
			role: ["team_user", [Validators.required]],
			email: ["", [Validators.required, Validators.email]],
			company_name: ["", [Validators.maxLength(100)]],
			job_title: ["", [Validators.maxLength(100)]],
			// password: ["", [Validators.required, Validators.minLength(6)]],
			// repassword: ["", [Validators.required, Validators.minLength(6)]],
			status: [true, [Validators.required]]
	    }
	    // , {
     //        validator: MustMatch('password', 'repassword')
     //    }
        );
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeams();
		}, 200);
		var fileUploadDataObject = {
	      url: this.httpClientService.serviceBase + 'fileupload',
	      itemAlias: "profile_picture",
	      additionalParameter: {"name": "kapil"},
	    };
	    this.uploader = new FileUploader(fileUploadDataObject);
	    this.uploadNow(this.uploader, this.httpClientService, ["jpg", "jpeg", "png"]);
	}

	getTeams() {
		var self = this;
		console.log("self.teamsData", self.teamsData);
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teams/all").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				var teamsData = [];
				for (var i = 0; i < res.data.length; i++) {
					teamsData.push({id: res.data[i]._id, text: res.data[i].title});
				}
				self.teamsData = teamsData;
			}
			else {
				// self.httpClientService.showError(res.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	ngOnDestroy(): void {
		$("#limitExceedModal").modal('hide');
	}

	onSuccessFunction(response) {
	    this.teamUserForm.patchValue({
	      profile_picture: response.data
	    })
	}

	get f() { return this.teamUserForm.controls; }

	saveTeamUser() {
		var self = this;
		this.submitted = true;
		console.log("this.teamUserForm", this.teamUserForm);
		if (this.teamUserForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.teamUserForm.value;
			this.httpClientService.post("teamusers/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo("teamusers");
				}
				else {
					if (res.data) {
						$("#limitExceedMessage").text(res.message);
						$("#limitExceedModal").modal('show');
					}
					else {
						self.httpClientService.showError(res.message);
					}
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			});
		}
	}
}

import { AbstractControl, ValidatorFn } from '@angular/forms';
export class customValidationService {
   static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } | null => {
        if ((c.value !== "" && c.value !== null) && (isNaN(c.value) || c.value < min || c.value.toString().length > max)) {
        	if (c.value ==0 || c.value < min) {
        		return { range: {requiredMinLength: min} };
        	}
        	else if(c.value.toString().length > max) {
        		return { range: {requiredMaxLength: max} };
        	}
        }
        return null;
    };
  }
}