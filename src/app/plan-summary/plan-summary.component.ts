import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
declare var Stripe;
@Component({
  selector: 'app-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.css']
})
export class PlanSummaryComponent implements OnInit {
	stripe:any;
	plan_id:string = null;
	plan_type:string = null;
	task_id:string = null;
	taskData:any;
	plan_summary:any = null;
	public upgradeSubscription:boolean = false;
	constructor(public authService: AuthService, public httpClientService: HttpClientService, private route: ActivatedRoute) {
		this.plan_id = route.snapshot.params.plan_id;
		this.plan_type = route.snapshot.params.plan_type;
		if (typeof route.snapshot.params.task_id != "undefined" && route.snapshot.params.task_id) {
			this.task_id = route.snapshot.params.task_id;
			this.getTaskData(this.task_id);
		}
	}

	ngOnInit(): void {
		let self = this;
		this.stripe = Stripe('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		setTimeout(function() {
			self.getPlanSummary();
		}, 200);
	}

	getPlanSummary() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			plan_type: this.plan_type,
			plan_id: this.plan_id
		}
		this.httpClientService.post("user-subscriptions/plansummary", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.plan_summary = res.data;
			}
			else {
				self.httpClientService.showError(res.message);
			}
			// self.getCurrentSubscription();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
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
			// self.getCurrentSubscription();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	addUpdatePlan() {
		if (this.plan_summary.upgradeSubscription) {
			// if (confirm("Are you sure you want to upgrade to your current plan?")) {
				var self = this;
				this.httpClientService.showLoader = true;
				var requestData = {
					plan_type: this.plan_type,
					plan_id: this.plan_id,
				}
				this.httpClientService.post("/user-subscriptions/upgrade", requestData).subscribe(function(res:any){
					self.httpClientService.showLoader = false;
					if (!res.error) {
						var userData = JSON.parse(localStorage.getItem("user"));
						userData.plan_name = res.data.plan_name;
						self.authService.loggedIn.next(userData);
						localStorage.setItem("user", JSON.stringify(userData));
						// self.httpClientService.showSuccess(res.message);
						self.httpClientService.goTo("auth-payment/upgrade/success/"+self.task_id);
					}
					else {
						self.httpClientService.showError(res.message);
					}
				}
				, error => {
					self.httpClientService.showLoader = false;
					self.httpClientService.showError(self.httpClientService.errorMessage);
				});
			// }
		}
		else {
			this.createuserstripesession();
		}
	}

	createuserstripesession() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			plan_type: this.plan_type,
			plan_id: this.plan_id,
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

	goBack() {
		var back_url = "upgradeplan";
		if (this.task_id) {
			back_url += "/tasks/"+this.task_id;
		}
		this.httpClientService.goTo(back_url);
	}
}
