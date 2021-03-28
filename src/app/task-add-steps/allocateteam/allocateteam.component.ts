import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-allocateteam',
  templateUrl: './allocateteam.component.html',
  styleUrls: ['./allocateteam.component.css']
})
export class AllocateteamComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public taskStepData:any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public teamsData:any = [];
	public allocateTeamForm: FormGroup;
	public submitted:boolean = false;
	public teamAddFrom:any = {
		title: "",
		user_ids: [],
		status: true
	};
	public form_team_name_submit: boolean = false;
	public form_team_name_invalid: boolean = false;
	public form_team_name_message: string = "";
	public allTeamUsersData:any = [];
	public teamUsersData:any = [];
	public searchKeyword: string = "";
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, public fb: FormBuilder) {
		this.task_id = route.snapshot.params.task_id;
		this.allocateTeamForm = fb.group({
			teams: this.fb.array([]),
	    });
	}

	get f() { return this.allocateTeamForm.controls; }
	get t() { return this.f.teams as FormArray; }

	checkValidationTeamName() {
		var returnData = false;
		if (this.teamAddFrom.title == "") {
			this.form_team_name_invalid = true;
			this.form_team_name_message = "Team name is required";
		}
		else if(this.teamAddFrom.title.length > 50) {
			this.form_team_name_invalid = true;
			this.form_team_name_message = "Team name should be max 50 characters";
		}
		else {
			this.form_team_name_invalid = false;
			this.form_team_name_message = "";
			returnData = true;
		}
		return returnData;
	}

	searchByKeyword() {
		this.teamUsersData = [];
		if (this.searchKeyword) {
			let obj = this.allTeamUsersData.find((o, i) => {
			    if (o.full_name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >=0 || o.email.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >=0) {
			        this.teamUsersData.push(this.allTeamUsersData[i]);
			    }
			});
		}
		else {
			this.teamUsersData = this.allTeamUsersData;
		}
	}

	getTeamUsers() {
		var self = this;
		this.allTeamUsersData = [];
		this.teamUsersData = [];
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teamusers/all").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.allTeamUsersData = res.data;
				self.teamUsersData = res.data;
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

	selectTeamUser(index) {
		var existUser = this.teamAddFrom.user_ids.indexOf(this.teamUsersData[index]._id.toString());
		if (existUser < 0) {
			this.teamAddFrom.user_ids.push(this.teamUsersData[index]._id.toString());
		}
		else {
			this.teamAddFrom.user_ids.splice(existUser, 1);
		}
	}

	findSelectedTeamUser(user_id) {
		if (this.teamAddFrom.user_ids.indexOf(user_id.toString()) >= 0) {
			return true;
		}
		else {
			return false;
		}
	}

	saveTeam() {
		var self = this;
		// this.submitted = true;
		// console.log("this.teamForm", this.teamForm);
		console.log("this.teamAddFrom", this.teamAddFrom);
		if (this.teamAddFrom.user_ids.length) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.teamAddFrom;
			this.httpClientService.post("teams/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.newTeamCreated(res.data);
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
		else {
			this.httpClientService.showError("Please select at least one member");
		}
	}

	newTeamCreated(team) {
		this.teamAddFrom = {
			title: "",
			user_ids: [],
			status: true
		};
		$("#addteammembers").modal('hide');
		this.form_team_name_submit = false;
		this.form_team_name_invalid = false;
		this.form_team_name_message = "";
		this.t.push(this.fb.group({
			team_name: [team.title],
			team_id: [team._id],
			is_selected: false,
			permissions: [[]]
		}));
		this.teamsData.push(team);
	}

	ngOnDestroy(): void {
		$("#creatnewteam").modal('hide');
		$("#addteammembers").modal('hide');
		$("#limitExceedModal").modal('hide');
	}

	createTeamModal() {
		this.teamAddFrom.title = "";
		this.form_team_name_submit = false;
		this.form_team_name_invalid = false;
		this.form_team_name_message = "";
		$("#creatnewteam").modal('show');
	}

	assignTeamUserModal() {
		this.form_team_name_submit = true;
		if (this.checkValidationTeamName()) {
			this.getTeamUsers();
			$("#creatnewteam").modal('hide');
			$("#addteammembers").modal('show');
		}
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
				self.getTeams();
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

	getTeams() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teams/all").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamsData = res.data;
				self.assignDataTypeColumnInputs();
			}
			self.fetchTaskStep();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	assignDataTypeColumnInputs() {
		for (var i = 0; i < this.teamsData.length; ++i) {
			this.t.push(this.fb.group({
				team_name: [this.teamsData[i].title],
				team_id: [this.teamsData[i]._id],
				is_selected: false,
				permissions: [[]]
			}));
		}
	}

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "teams_manage"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				if (self.taskStepData.data.teams.length) {
					var is_data;
					for (var i = 0; i < self.t.controls.length; ++i) {
						is_data = self.taskStepData.data.teams.find(o => o.team_id === self.t.value[i].team_id);
						if (is_data) {
							self.t.controls[i].patchValue({
								is_selected: true,
								permissions: is_data.permissions ? is_data.permissions : []
							});
						}
					}
				}
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	saveAllocateTeam() {
		this.submitted = true;
		var is_any_team_select = false;
		for (var i = 0; i < this.allocateTeamForm.value.teams.length; ++i) {
			if (this.allocateTeamForm.value.teams[i].is_selected) {
				is_any_team_select = true;
				break;
			}
		}
		if (this.allocateTeamForm.valid && is_any_team_select) {
			var teams_data = {
				teams: []
			};
			for (var i = 0; i < this.allocateTeamForm.value.teams.length; ++i) {
				if (this.allocateTeamForm.value.teams[i].is_selected) {
					teams_data.teams.push({
						team_id: this.allocateTeamForm.value.teams[i].team_id,
						team_name: this.allocateTeamForm.value.teams[i].team_name,
						permissions: this.allocateTeamForm.value.teams[i].permissions
					})
				}
			}
			var taskStepRequestData = {
				task_id: this.task_id,
				type: "teams_manage",
				data: teams_data,
				step_complete: false
			};
			this.saveTaskStep(taskStepRequestData);
		}
		else {
			this.httpClientService.showError("Please select at least one team");
		}
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				var goTo = "tasks/configurecolumnpermissions/"+self.task_id;
				self.httpClientService.goTo(goTo);
			}
			else {
				self.httpClientService.showError(saveTaskStepRes.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}
}
