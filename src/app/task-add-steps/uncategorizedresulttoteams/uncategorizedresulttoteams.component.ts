import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-uncategorizedresulttoteams',
  templateUrl: './uncategorizedresulttoteams.component.html',
  styleUrls: ['./uncategorizedresulttoteams.component.css']
})
export class UncategorizedresulttoteamsComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public taskStepData:any;
	public teamsData:any = [];
	submitted:boolean = false;
	uncategorizedTeamForm: FormGroup;
	public matchingdataanalytics:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.task_id = route.snapshot.params.task_id;
		this.uncategorizedTeamForm = fb.group({
			boolean_question: ["1", [Validators.required]],
			type: ["percent", [Validators.required]],
			teams_data: this.fb.array([]),
	    });
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.matchingDataAnalytics();
			});
		}, 500);
	}

	get f() { return this.uncategorizedTeamForm.controls; }
	get t() { return this.f.teams_data as FormArray; }

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
				if(cb) cb();
			}
			else {
				self.httpClientService.showError(taskRes.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	matchingDataAnalytics() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id
		}
		this.httpClientService.post("tasks/matchingdataanalytics", requestData).subscribe(function (matchingdataanalytics: any) {
			self.httpClientService.showLoader = false;
			if (!matchingdataanalytics.error) {
				self.matchingdataanalytics = matchingdataanalytics.data;
				if (!self.matchingdataanalytics.tota_unmatch_rows) {
					self.httpClientService.goTo("tasks/setstartdate/"+self.task_id);
				}
				self.getTeams();
			}
			else {
				self.httpClientService.goTo("tasks/wantconfigurebusinessrules/"+self.task_id);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "uncategorized_result_divide"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				self.uncategorizedTeamForm.patchValue({
					boolean_question: self.taskStepData.boolean_question ? "1" : "0",
					type: self.taskStepData.boolean_question && self.taskStepData.data ? self.taskStepData.data.type : "percent",
				});
			}
			self.addTeamsData();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	getTeams() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "teams_manage"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamsData = res.data.data.teams;
				self.fetchTaskStep();
			}
			else {
				self.httpClientService.goTo("tasks/allocateteam/"+self.task_id);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	addTeamsData() {
		var value = 0;
		var data = null;
		for (var i = 0; i < this.teamsData.length; ++i) {
			value = 0;
			if (this.taskStepData && this.taskStepData.boolean_question && this.taskStepData.data && this.taskStepData.data.teams_data.length) {
				data = this.taskStepData.data.teams_data.find(o => o.team_id === this.teamsData[i].team_id);
				if (data) {
					value = data.value;
				}
			}
			this.t.push(this.fb.group({
                team_id: [this.teamsData[i].team_id, [Validators.required]],
                team_name: [this.teamsData[i].team_name, [Validators.required]],
                value: [value, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0)]],
            }))
		}
		if (!this.taskStepData || !this.taskStepData.boolean_question || !this.taskStepData.data || !this.taskStepData.data.teams_data.length) {
			this.setDefualtValueCalculation();
		}
	}

	setDefualtValueCalculation() {
		let self = this;
		setTimeout(function () {
			var total_teams = self.teamsData.length;
			var tota_unmatch_rows = self.matchingdataanalytics && self.matchingdataanalytics.tota_unmatch_rows ? self.matchingdataanalytics.tota_unmatch_rows : 0;
			var type = self.uncategorizedTeamForm.value.type;
			var perTeamValue = 0;
			var lastTeamValue = 0;
			if (tota_unmatch_rows && self.uncategorizedTeamForm.value.boolean_question == "1") {	
				if (type == "percent") {
					if (tota_unmatch_rows < total_teams) {
						perTeamValue = Math.floor((100 / tota_unmatch_rows));
					}
					else {
						perTeamValue = Math.floor((100 / total_teams));
					}
					lastTeamValue = (perTeamValue * total_teams) < 100 ? ((100 - (perTeamValue * total_teams)) + perTeamValue) : perTeamValue;
				}
				else {
					if (tota_unmatch_rows < total_teams) {
						perTeamValue = 1;
					}
					else {
						perTeamValue = Math.floor((tota_unmatch_rows / total_teams));
					}
					lastTeamValue = (perTeamValue * total_teams) < tota_unmatch_rows ? ((tota_unmatch_rows - (perTeamValue * total_teams)) + perTeamValue) : perTeamValue;
				}
			}
			var loopLength = tota_unmatch_rows < total_teams ? tota_unmatch_rows : total_teams;
			for (var i = 0; i < loopLength; ++i) {
				self.t.controls[i].patchValue({
					value: ((i+1) < loopLength ? perTeamValue : lastTeamValue)
				});
			}
		}, 200);
	}

	saveUncategorizedTeam() {
		this.submitted = true;
		var uncategorizedTeamData = {
			type: this.uncategorizedTeamForm.value.type,
			teams_data: this.uncategorizedTeamForm.value.teams_data
		}
		if (this.uncategorizedTeamForm.value.boolean_question=="1") {
			var total_value = 0;
			for (var i = 0; i < uncategorizedTeamData.teams_data.length; ++i) {
				if (uncategorizedTeamData.teams_data[i].value) {
					total_value += uncategorizedTeamData.teams_data[i].value;
				}
			}
			if (this.uncategorizedTeamForm.value.type == "percent") {
				if (!total_value) {
					this.httpClientService.showError("The total percentage of teams input should be minimum 1");
					return false;
				}
				else if (total_value > 100) {
					this.httpClientService.showError("The total percentage of teams input should be max 100");
					return false;
				}
			}
			else {
				if (!total_value) {
					this.httpClientService.showError("The records of teams input should be minimum 1");
					return false;
				}
				else if (total_value > this.matchingdataanalytics.tota_unmatch_rows) {
					this.httpClientService.showError("The records of teams input should be max "+this.matchingdataanalytics.tota_unmatch_rows);
					return false;
				}
			}
		}
		if (this.uncategorizedTeamForm.valid) {
			var taskStepRequestData = {
				task_id: this.task_id,
				boolean_question: this.uncategorizedTeamForm.value.boolean_question=="1" ? true : false,
				type: "uncategorized_result_divide",
				data: this.uncategorizedTeamForm.value.boolean_question=="1" ? uncategorizedTeamData : [],
				step_complete: true
			};
			this.saveTaskStep(taskStepRequestData);
		}
		else {
			// this.httpClientService.showError("Please add at least one business rule");
		}
		
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				var goTo = "tasks/setstartdate/"+self.task_id;
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
