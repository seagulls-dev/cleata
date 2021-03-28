import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
declare var Stripe;
@Component({
  selector: 'app-upgradeplan',
  templateUrl: './upgradeplan.component.html',
  styleUrls: ['./upgradeplan.component.css']
})
export class UpgradeplanComponent implements OnInit {
	userSubscription:any = null;
	plans:any = {
		month_plan: [],
		year_plan: []
	};
	public selectedPlan:any = {
		plan_index: null,
		plan_type: null,
		type: null
	};
	public upgradeSubscription:boolean = false;
	public userData: any;
	stripe:any;
	task_id:string = null;
	taskData:any;
	constructor(public httpClientService: HttpClientService, private route: ActivatedRoute) {
		if (typeof route.snapshot.params.task_id != "undefined" && route.snapshot.params.task_id) {
			this.task_id = route.snapshot.params.task_id;
			this.getTaskData(this.task_id);
		}
		if (typeof route.snapshot.params.stripe_callback != "undefined" && route.snapshot.params.stripe_callback == "cancel") {
			this.httpClientService.showError("Transaction failed!");
		}
		this.userData = JSON.parse(localStorage.getItem("user"));
	}

	ngOnInit(): void {
		let self = this;
		this.stripe = Stripe('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		setTimeout(function() {
			self.getUser();
			if (!self.task_id) {
				self.getCurrentSubscription();
			}
		}, 200);
	}

	selectPlan(plan_index, plan_type) {
		this.selectedPlan.plan_index = plan_index;
		this.selectedPlan.plan_type = plan_type;
		this.selectedPlan.type = plan_type == "month" ? this.plans.month_plan[plan_index].type : this.plans.year_plan[plan_index].type;
	}

	getTaskData(task_id) {
		var self = this;
		// this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/detail/"+task_id).subscribe(function(res:any){
			// self.httpClientService.showLoader = false;
			if (!res.error) {
				self.taskData = res.data;
			}
			else {
				// self.httpClientService.showError(res.message);
			}
			self.getCurrentSubscription();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	getUser() {
		var self = this;
		// this.httpClientService.showLoader = true;
		this.httpClientService.get("users/view/"+this.userData._id).subscribe(function(res:any){
			// self.httpClientService.showLoader = false;
			if (!res.error) {
				this.userData = res.data;
				if (typeof this.userData.stripe_subscription_id && this.userData.stripe_subscription_id) {
					self.upgradeSubscription = true;
				}
			}
			else {
				// self.httpClientService.showError(res.message);
			}
		}
		, error => {
			// self.httpClientService.showLoader = false;
			// self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	getCurrentSubscription() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("user-subscriptions").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.userSubscription = res.data;
			}
			else {
				// self.httpClientService.showError(res.message);
			}
			self.getPlans();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	getPlans() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("plans").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				for (var i = 0; i < res.data.length; i++) {
					if(res.data[i].month_amount && self.checkshowupgradeplan(res.data[i], 'month')) {
						self.plans.month_plan.push(res.data[i]);
					}
					if(res.data[i].year_amount && self.checkshowupgradeplan(res.data[i], 'year')) {
						self.plans.year_plan.push(res.data[i]);
					}
				}
				// self.plans = res.data;
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

	addUpdatePlan() {
		if (!this.selectedPlan.plan_type || this.selectedPlan.plan_index === null || !this.selectedPlan.type) {
			return false;
		}
		if (this.selectedPlan.type == "support") {
			this.httpClientService.goTo("contactus");
		}
		else {
			var plan_id = (this.selectedPlan.plan_type == "month" ? this.plans.month_plan[this.selectedPlan.plan_index]._id : this.plans.year_plan[this.selectedPlan.plan_index]._id);
			var plan_summary_url = "plan-summary/"+this.selectedPlan.plan_type+"/"+plan_id;
			if (this.task_id) {
				plan_summary_url += "/"+this.task_id;
			}
			this.httpClientService.goTo(plan_summary_url);
		}
	}

	createuserstripesession() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			plan_type: this.selectedPlan.plan_type,
			plan_id: (this.selectedPlan.plan_type == "month" ? this.plans.month_plan[this.selectedPlan.plan_index]._id : this.plans.year_plan[this.selectedPlan.plan_index]._id),
			task_id: this.task_id
		}
		this.httpClientService.post("users/createuserstripesession", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				try{
					self.stripe.redirectToCheckout({
					  sessionId: res.data.stripe_session_id
					}).then(function (result) {
					  self.httpClientService.showError(result.error.message);
					});
				}
				catch(err) {
					self.httpClientService.showError(err.message);
				}
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

	checkshowupgradeplan(plan_data, type) { //todo
		var plan_amount = type == "month" ? plan_data.month_amount : plan_data.year_amount;
		var plan_id = type == "month" ? plan_data._id : plan_data._id;
		console.log("plan_amount", plan_amount);
		if (plan_amount) {
			if (this.userSubscription) {
				if (type == "month") {
					// if (this.userSubscription.plan_id == plan_data._id && this.userSubscription.type == "month") {
					// 	return true;
					// }
					if (this.taskData) {
						if ((plan_data._id.toString() != this.userSubscription.plan_id.toString() && plan_data.total_rows >= this.userSubscription.total_rows && plan_data.total_rows >= (this.taskData.total_task_data-1)) || plan_data.total_rows == -1) {
							return true
						}
					}
					else {
						if (plan_amount > this.userSubscription.amount) {
							return true;
						}
					}
				}
				else {
					// if (this.userSubscription.plan_id == plan_data._id && this.userSubscription.type == "year") {
					// 	return true;
					// }
					if (this.taskData) {
						if ((plan_data._id.toString() != this.userSubscription.plan_id.toString() && plan_data.total_rows >= this.userSubscription.total_rows && plan_data.total_rows >= (this.taskData.total_task_data-1)) || plan_data.total_rows == -1) {
							return true
						}
					}
					else {
						console.log("else", this.userSubscription.amount);
						if (plan_amount > this.userSubscription.amount) {
							console.log("if new")
							return true;
						}
					}
					// if (plan_amount > this.userSubscription.amount && plan_id != this.userSubscription.plan_id) {
					// 	return true;
					// }
				}
			}
			else {
				return true;
			}
		}
		return false;
	}
}
