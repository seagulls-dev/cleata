import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taskrulesadd',
  templateUrl: './taskrulesadd.component.html',
  styleUrls: ['./taskrulesadd.component.css']
})
export class TaskrulesaddComponent implements OnInit {
	submitted:boolean = false;
	taskRuleForm: FormGroup;
	public teamsData: Array<Select2OptionData>;
	public task_id:string;
	public taskData:any;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private route: ActivatedRoute) {
		this.task_id = route.snapshot.params.task_id;
		this.taskRuleForm = fb.group({
			task_id: [this.task_id],
			rules_data: this.fb.array([]),
	    });
	    this.addRemoveRuleData(1);
	    this.addRemoveRuleData(1);
	}

	get f() { return this.taskRuleForm.controls; }
	get t() { return this.f.rules_data as FormArray; }
	c(index) { return this.t.controls[index].get("conditions") as FormArray; }

	addRemoveRuleData(type, index=0) {
		if (type) {
			var pushIndex = (this.t.length - 1);
			console.log("pushIndex", pushIndex);
			var team_ids_validation = [[], Validators.required];
			if (pushIndex < 0) {
				team_ids_validation = [[]];
			}
			this.t.insert(pushIndex, this.fb.group({
                team_ids: team_ids_validation,
                conditions: this.fb.array([]),
            }))
            if (pushIndex >= 0) {
            	this.addRemoveConditionData(pushIndex, 1); 
            }
           	
		}
		else {
			this.t.removeAt(index);
		}
	}

	addRemoveConditionData(rule_index, type, index=0) {
		if (type) {
			this.c(rule_index).push(this.fb.group({
                header_index: ['', [Validators.required]],
                operator: ['', [Validators.required]],
                condition_value: ['', [Validators.required, Validators.maxLength(50)]],
            }))
		}
		else {
			this.c(rule_index).removeAt(index);
		}
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTask();
			self.getTeams();
		}, 200);
	}

	getTeams() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("activeteams").subscribe(function(res:any){
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

	getTask() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/"+this.task_id).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData = res.data.task;
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

	saveTaskRules() {
		var self = this;
		this.submitted = true;
		// console.log("this.taskRuleForm", this.taskRuleForm);
		if (this.taskRuleForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.taskRuleForm.value;
			this.httpClientService.post("taskrules/add", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.assignTaskUser(res.message);
					// self.httpClientService.goTo("taskpermissions/add/"+self.task_id);
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			});
		}
	}

	assignTaskUser(message) {
		var self = this;
		this.submitted = true;
		// console.log("this.taskRuleForm", this.taskRuleForm);
		if (this.taskRuleForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = {
				task_id: this.task_id
			};
			this.httpClientService.post("tasks/assigntask", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(message);
					self.httpClientService.goTo("taskpermissions/add/"+self.task_id);
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			});
		}
	}

}
