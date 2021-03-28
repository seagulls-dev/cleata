import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseClass } from '../services/BaseClass';
import { FileUploader } from 'ng2-file-upload';
import { Select2OptionData } from 'ng-select2';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseClass implements OnInit {
	submitted:boolean = false;
	profileForm: FormGroup;
	public userData: any;
	public countiresData: Array<Select2OptionData>;
	constructor(public authService: AuthService, public httpClientService: HttpClientService, private fb: FormBuilder) {
		super();
		this.userData = JSON.parse(localStorage.getItem("user"));
		this.profileForm = fb.group({
			first_name: [this.userData.first_name, [Validators.required, Validators.maxLength(100)]],
			last_name: [this.userData.last_name, [Validators.required, Validators.maxLength(100)]],
			country: [this.userData.country, []],
			mobile: [this.userData.mobile, [customValidationService.checkLimit(1, 15)]],
			email: [{value: this.userData.email, disabled: true}, [Validators.required, Validators.email]],
			company_name: [this.userData.company_name, [Validators.maxLength(100)]],
			job_title: [this.userData.job_title, [Validators.maxLength(100)]],
			profile_picture: [this.userData.profile_picture],
	    });
	    if (this.userData.role == "team_user") {
	    	this.profileForm.get('job_title').setValidators([Validators.required]);
			this.profileForm.get('job_title').updateValueAndValidity();
	    }
	    else if (this.userData.role == "business_user") {
	    	this.profileForm.get('country').setValidators([Validators.required]);
			this.profileForm.get('country').updateValueAndValidity();
	    }
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getCountries();
		}, 200);
		var fileUploadDataObject = {
	      url: this.httpClientService.serviceBase + 'fileupload',
	      itemAlias: "profile_picture"
	    };
	    this.uploader = new FileUploader(fileUploadDataObject);
	    this.uploadNow(this.uploader, this.httpClientService, ["jpg", "jpeg", "png"]);
	}

	getCountries() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("countries").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				var countiresData = [];
				for (var i = 0; i < res.data.length; i++) {
					countiresData.push({id: res.data[i]._id, text: res.data[i].name});
				}
				self.countiresData = countiresData;
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

	onSuccessFunction(response) {
	    this.profileForm.patchValue({
	      profile_picture: response.data
	    })
	}

	get f() { return this.profileForm.controls; }

	saveProfile() {
		var self = this;
		this.submitted = true;
		if (this.profileForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.profileForm.value;
			this.httpClientService.post("update-user", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					var userData = res.data;
					userData.token = self.userData.token;
					userData.plan_name = res.plan_name;
					userData.plan_type = res.plan_type;
					self.authService.loggedIn.next(userData);
					localStorage.setItem("user", JSON.stringify(userData));
					self.httpClientService.showSuccess(res.message);
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