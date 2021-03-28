import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
declare var Stripe;
@Component({
  selector: 'app-paymentconfirmation',
  templateUrl: './paymentconfirmation.component.html',
  styleUrls: ['./paymentconfirmation.component.css']
})
export class PaymentconfirmationComponent implements OnInit {
	stripe:any;
	// task_id:string = null;
	// plan_id:string = null;
	// plan_type:string = null;
	stripe_callback:string = null;
	stripeData:any = null;
	stripe_session_id:string = null;
	checkoutSuccess:boolean = false;
	hasError:boolean = false;
	errorMessage:string = null;
	constructor(public authService: AuthService, public httpClientService: HttpClientService, private route: ActivatedRoute) {
		this.stripe_callback = route.snapshot.params.stripe_callback;
		this.stripe_session_id = route.snapshot.params.stripe_session_id;
		// if (typeof route.snapshot.params.task_id != "undefined" && route.snapshot.params.task_id) {
		// 	this.task_id = route.snapshot.params.task_id;
		// }
	}

	ngOnInit(): void {
		let self = this;
		this.stripe = Stripe('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		setTimeout(function() {
			self.getStripeCheckoutSessionData();
		}, 200);
	}

	getStripeCheckoutSessionData() {
		let self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			stripe_session_id: this.stripe_session_id
		}
		this.httpClientService.post("user-subscriptions/get-checkout-session-data", requestData).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.stripeData = res.data;
				if (self.stripe_callback == "success") {
					self.subscriptionAddCheckout();
				}
			}
			else {
				self.hasError = true;
				self.errorMessage = res.message;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.hasError = true;
			self.errorMessage = self.httpClientService.errorMessage;
			// self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	subscriptionAddCheckout() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("user-subscriptions/addcheckout", {stripe_session_id: this.stripe_session_id}).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				var userData = JSON.parse(localStorage.getItem("user"));
				userData.plan_name = res.data.plan_name;
				userData.plan_type = res.data.plan_type;
				self.authService.loggedIn.next(userData);
				localStorage.setItem("user", JSON.stringify(userData));
				self.checkoutSuccess = true;
			}
			else {
				self.hasError = true;
				self.errorMessage = res.message;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.hasError = true;
			self.errorMessage = self.httpClientService.errorMessage;
		});
	}

	createuserstripesession() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			plan_type: this.stripeData.plan_type,
			plan_id: this.stripeData.plan_id,
			task_id: this.stripeData.task_id
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
		var back_url = "plan-summary/month/"+this.stripeData.plan_id;
		if (this.stripeData.task_id) {
			back_url = back_url+"/"+this.stripeData.task_id;
		}
		this.httpClientService.goTo(back_url);
	}

	goContinue() {
		var back_url = "dashboard";
		if (this.stripeData.task_id) {
			back_url = "tasks/doesheader/"+this.stripeData.task_id;
		}
		this.httpClientService.goTo(back_url);
	}

}
