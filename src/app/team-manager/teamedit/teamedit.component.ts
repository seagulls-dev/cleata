import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-teamedit',
  templateUrl: './teamedit.component.html',
  styleUrls: ['./teamedit.component.css']
})
export class TeameditComponent implements OnInit {
	submitted:boolean = false;
	teamForm: FormGroup;
	public team_id:string;
	public teamData:any;
	public teamUserData: Array<Select2OptionData>;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private route: ActivatedRoute) {
		this.team_id = route.snapshot.params.id;
		this.teamForm = fb.group({
			id: ["", Validators.required],
			title: ["", [Validators.required, Validators.maxLength(50)]],
			user_ids: [[]],
			description: ["", [Validators.required, Validators.maxLength(1000)]],
			status: [false, [Validators.required]]
	    });
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeam();
			self.getTeamUsers();
		}, 200);
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

	getTeam() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teams/view/"+this.team_id).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamData = res.data.team;
				var user_ids = [];
				for (var i = 0; i < res.data.team_users.length; i++) {
					user_ids.push(res.data.team_users[i].user_id._id);
				}
				self.teamForm.patchValue({
					id: self.teamData._id,
					title: self.teamData.title,
					user_ids: user_ids,
					description: self.teamData.description,
					status: self.teamData.status
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
