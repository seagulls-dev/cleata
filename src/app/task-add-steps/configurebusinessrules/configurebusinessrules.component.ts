import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-configurebusinessrules',
  templateUrl: './configurebusinessrules.component.html',
  styleUrls: ['./configurebusinessrules.component.css']
})
export class ConfigurebusinessrulesComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public taskStepData:any;
	submitted:boolean = false;
	taskRuleForm: FormGroup;
	public teamsData: Array<Select2OptionData>;
	// public conditionsData: any = [];
	public businessRules:any = [];
	public taskHeaderStepData:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, private fb: FormBuilder) {
		// this.conditionsData = [
		// 	{"label": "IS EQUAL TO", "value": "="},
		// 	{"label": "IS NOT EQUAL TO", "value": "!="},
		// 	{"label": "IS LIKE", "value": "%"},
		// 	{"label": "IS NOT LIKE", "value": "="},
		// 	{"label": "CONTAINS", "value": "="},
		// 	{"label": "DOES NOT CONTAIN", "value": "="},
		// 	{"label": "IS EMPTY", "value": "="},
		// 	{"label": "IS NOT EMPTY", "value": "="},
		// 	{"label": "IS LESS THAN", "value": "="},
		// 	{"label": "IS LESS THAN EQUAL TO", "value": "="},
		// 	{"label": "IS GREATER THAN", "value": "="},
		// 	{"label": "IS GREATER THAN EQUAL TO", "value": "="},
		// ]
		this.task_id = route.snapshot.params.task_id;
		this.taskRuleForm = fb.group({
			rule_name: ["", [Validators.required]],
			team_ids: [[], Validators.required],
			conditions: this.fb.array([]),
	    });
	    this.addRemoveConditionData(1);
	}

	get f() { return this.taskRuleForm.controls; }
	get t() { return this.f.conditions as FormArray; }

	addRemoveConditionData(type, index=0) {
		if (type) {
			this.t.push(this.fb.group({
                header_index: ['', [Validators.required]],
                operator: ['', [Validators.required]],
                condition_value: ['', [Validators.required, Validators.maxLength(50)]],
            }))
		}
		else {
			this.t.removeAt(index);
		}
	}

	saveNewBusinessRule() {
		console.log(this.taskRuleForm.value);
		var self = this;
		this.submitted = true;
		// console.log("this.taskRuleForm", this.taskRuleForm);
		if (this.taskRuleForm.valid) {
			this.businessRules.push(this.taskRuleForm.value);
			this.submitted = false;
			this.taskRuleForm.reset();
			this.t.clear();
			this.addRemoveConditionData(1);
		}
	}

	drop(event: CdkDragDrop<string[]>) {
	    moveItemInArray(this.businessRules, event.previousIndex, event.currentIndex);
	    console.log("this.businessRules", this.businessRules);
	  }

	getTeamNamebyId(team_id) {
		if (this.teamsData && this.teamsData.length) {
			var teams = this.teamsData.find(o => o.id === team_id);
			return teams.text;
		}
		return false;
	}

	removeNewBusinessRule(index) {
		this.businessRules.splice(index, 1);
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchTaskHeaderStep();
				// self.fetchTaskStep();
			});
		}, 500);
	}

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
			}
			else {
				self.httpClientService.showError(taskRes.message);
			}
			if(cb) cb();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchTaskHeaderStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "does_header"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskHeaderStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskHeaderStepRes.error) {
				self.taskHeaderStepData = taskHeaderStepRes.data;
				if (!self.taskHeaderStepData.step_complete || !self.taskHeaderStepData.data.length) {
					self.httpClientService.goTo("tasks/doesheader/"+self.task_id);
				}
				else {
					self.fetchTaskStep();
				}
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
			type: "business_rules"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				self.businessRules = self.taskStepData.data;
				if (!self.taskStepData.boolean_question) {
					self.httpClientService.goTo("tasks/wantconfigurebusinessrules/"+self.task_id);
				}
				else {
					self.getTeams();
				}
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
				var teamsData = [];
				for (var i = 0; i < res.data.data.teams.length; i++) {
					teamsData.push({id: res.data.data.teams[i].team_id, text: res.data.data.teams[i].team_name});
				}
				self.teamsData = teamsData;
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

	getConditionString(index) {
		var returnData = "";
		var conditions = null;
		var operator = "";
		var condition_value = "";
		for (var i = 0; i < this.businessRules[index].conditions.length; ++i) {
			conditions = this.businessRules[index].conditions;
			operator = conditions[i].operator;
			condition_value = " "+conditions[i].condition_value;
			if (operator == "%") {
				operator = "CONTAINS";
			}
			else if (operator == "!%") {
				operator = "NOT CONTAINS";
			}
			else if (operator == "null") {
				operator = "IS EMPTY";
				condition_value = ""; 
			}
			else if (operator == "!null") {
				operator = "IS NOT EMPTY";
				condition_value = "";
			}
			if (i) {
				returnData += " AND ";
			}
			returnData += '<span class="text-blue-700">'+this.taskHeaderStepData.data[parseInt(conditions[i].header_index)].column_name+' '+operator+condition_value+'</span>';

		}
		return returnData;
	}

	saveConfigureBusinessRules() {
		console.log(this.businessRules);
		if (this.businessRules.length) {
			var taskStepRequestData = {
				task_id: this.task_id,
				type: "business_rules",
				data: this.businessRules,
				step_complete: true
			};
			this.saveTaskStep(taskStepRequestData);
		}
		else {
			this.httpClientService.showError("Please add at least one business rule");
		}
		
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				var goTo = "tasks/reviewmatchingdata/"+self.task_id;
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
