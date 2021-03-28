import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseClass } from '../../services/BaseClass';
import { FileUploader } from 'ng2-file-upload';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-teamuseredit',
  templateUrl: './teamuseredit.component.html',
  styleUrls: ['./teamuseredit.component.css']
})
export class TeamusereditComponent extends BaseClass implements OnInit {
	submitted:boolean = false;
	teamUserForm: FormGroup;
	public team_id:string;
	public teamUserData:any;
	fileData: File = null;
	public teamsData: Array<Select2OptionData>;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private route: ActivatedRoute) {
  		super();
  		this.team_id = route.snapshot.params.id;
		this.teamUserForm = fb.group({
			_id: ["", Validators.required],
			first_name: ["", [Validators.required, Validators.maxLength(100)]],
			last_name: ["", [Validators.required, Validators.maxLength(100)]],
			team_ids: [[]],
			mobile: ["", [customValidationService.checkLimit(1, 15)]],
			profile_picture: [""],
			email: ["", [Validators.required, Validators.email]],
			company_name: ["", [Validators.maxLength(100)]],
			job_title: ["", [Validators.maxLength(100)]],
			status: [false, [Validators.required]]
	    });
	}

	fileProgress(fileInput: any) {
		let self = this;
		this.fileData = <File>fileInput.target.files[0];
	}

	ngOnInit(): void {
		let self = this;
		var fileUploadDataObject = {
	      url: this.httpClientService.serviceBase + 'fileupload',
	      itemAlias: "profile_picture",
	      additionalParameter: {"name": "kapil"},
	    };
	    this.uploader = new FileUploader(fileUploadDataObject);
	    this.uploadNow(this.uploader, this.httpClientService, ["jpg", "jpeg", "png"]);
		setTimeout(function() {
			self.getTeamUser();
			self.getTeamUsers();
		}, 200);
	}

	getTeamUsers() {
		var self = this;
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

	onSuccessFunction(response) {
	    this.teamUserForm.patchValue({
	      profile_picture: response.data
	    })
	    // this.edituser();
	}

	getTeamUser() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teamusers/view/"+this.team_id).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamUserData = res.data;
				var team_ids = [];
				for (var i = 0; i < res.data.user_teams.length; i++) {
					team_ids.push(res.data.user_teams[i].team_id._id);
				}
				console.log("team_ids", team_ids);
				self.teamUserForm.patchValue({
					_id: self.teamUserData.user._id,
					first_name: self.teamUserData.user.first_name,
					last_name: self.teamUserData.user.last_name,
					team_ids: team_ids,
					mobile: self.teamUserData.user.mobile,
					company_name: self.teamUserData.user.company_name,
					job_title: self.teamUserData.user.job_title,
					profile_picture: self.teamUserData.user.profile_picture,
					email: self.teamUserData.user.email,
					status: self.teamUserData.user.status
				});
				console.log("self.teamUserForm", self.teamUserForm);
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

	get f() { return this.teamUserForm.controls; }

	saveTeamUser() {
		var self = this;
		this.submitted = true;
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