import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
declare var $: any;

@Component({
  selector: 'app-teamadd',
  templateUrl: './teamadd.component.html',
  styleUrls: ['./teamadd.component.css']
})
export class TeamaddComponent implements OnInit {
	submitted:boolean = false;
	teamForm: FormGroup;
	public teamUserData: Array<Select2OptionData>;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		console.log("teamUserData", this.teamUserData);
		this.teamForm = fb.group({
			title: ["", [Validators.required, Validators.maxLength(50)]],
			user_ids: [[]],
			description: ["", [Validators.required, Validators.maxLength(1000)]],
			status: [true, [Validators.required]]
	    });
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeamUsers();
		}, 200);
	}

	ngOnDestroy(): void {
		$("#limitExceedModal").modal('hide');
	}

	getTeamUsers() {
		var self = this;
		console.log("self.teamUserData", self.teamUserData);
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teamusers/all").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				var teamUserData = [];
				for (var i = 0; i < res.data.length; i++) {
					teamUserData.push({id: res.data[i]._id, text: res.data[i].email});
				}
				self.teamUserData = teamUserData;
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

	get f() { return this.teamForm.controls; }

	saveTeam() {
		var self = this;
		this.submitted = true;
		console.log("this.teamForm", this.teamForm);
		if (this.teamForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.teamForm.value;
			this.httpClientService.post("teams/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo("teams");
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
