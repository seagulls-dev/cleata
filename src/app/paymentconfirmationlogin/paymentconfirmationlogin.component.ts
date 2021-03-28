import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
declare var Stripe;
@Component({
  selector: 'app-paymentconfirmationlogin',
  templateUrl: './paymentconfirmationlogin.component.html',
  styleUrls: ['./paymentconfirmationlogin.component.css']
})
export class PaymentconfirmationloginComponent implements OnInit {
	stripe:any;
	stripe_callback:string;
	stripe_session_id:string;
	checkoutSuccess:boolean = false;
	hasError:boolean = false;
	errorMessage:string = null;
	successMessage:string = null;
	stripeData:any = null;
	constructor(public httpClientService: HttpClientService, private route: ActivatedRoute) {
		this.stripe_callback = route.snapshot.params.stripe_callback;
		this.stripe_session_id = route.snapshot.params.stripe_session_id;
	}

	ngOnInit(): void {
		let self = this;
		this.stripe = Stripe('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		setTimeout(function() {
			// if (self.stripe_callback == "success" && self.stripe_session_id) {
				self.getStripeCheckoutSessionData();
			// }
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
					console.log("success");
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
				self.checkoutSuccess = true;
				self.successMessage = res.message;
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
			stripe_session_id: this.stripe_session_id,
			plan_type: this.stripeData.plan_type,
			plan_id: this.stripeData.plan_id
		}
		this.httpClientService.post("users/createuserstripesessionnonlogin", requestData).subscribe(function(res:any){
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
		var back_url = "";
		this.httpClientService.goTo(back_url);
	}

	goContinue() {
		var back_url = "login";
		this.httpClientService.goTo(back_url);
	}
}
