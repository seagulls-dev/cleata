import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-registercheckout',
  templateUrl: './registercheckout.component.html',
  styleUrls: ['./registercheckout.component.css']
})
export class RegistercheckoutComponent implements OnInit {
	submitted:boolean = false;
	checkoutForm: FormGroup;
	plan_type:string;
	plan_id:string;
	user_id:string;
	@ViewChild(StripeCardComponent) card: StripeCardComponent;
  	elementsOptions: ElementsOptions = {
	    locale: 'en'
	};
	cardOptions: ElementOptions = {
	    style: {
			base: {
				iconColor: '#495057',
				color: '#495057',
				lineHeight: '46px',
				fontWeight: 300,
				fontFamily: 'inherit',
				fontSize: '14px',
				'::placeholder': {
					color: '#828181',
					opacity: 1
				}
			}
	    }
  	};
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private stripeService: StripeService, private route: ActivatedRoute) {
		this.plan_type = route.snapshot.params.plan_type;
		this.plan_id = route.snapshot.params.plan_id;
		this.user_id = route.snapshot.params.user_id;
		this.checkoutForm = fb.group({
			email: [""],
			name: [""],
	    });
	}

	ngOnInit(): void {
		this.stripeService.setKey('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		let self = this;
		setTimeout(function() {
			self.getUser();
		}, 200);
	}

	getUser() {
		var self = this;
		// this.httpClientService.showLoader = true;
		this.httpClientService.get("users/view/"+this.user_id).subscribe(function(res:any){
			// self.httpClientService.showLoader = false;
			if (!res.error) {
				self.checkoutForm.patchValue({
					email: res.data.email,
					name: res.data.name
				});
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

	get f() { return this.checkoutForm.controls; }

	buy() {
		var self = this;
	    // const email = this.checkoutForm.value.email;
	    this.httpClientService.showLoader = true;
	    this.stripeService
	      .createToken(this.card.getCard(), this.checkoutForm.value)
	      .subscribe(result => {
	      	this.httpClientService.showLoader = false;
	        if (result.token) {
	          // Use the token to create a charge or a customer
	          // https://stripe.com/docs/charges
	          self.subscribeUser(result.token.id);
	        } else if (result.error) {
	          this.httpClientService.showLoader = false;
	          this.httpClientService.showError(result.error.message);
	        }
	      });
	  }

	subscribeUser(stripe_token) {
		var self = this;
		this.submitted = true;
		if (this.checkoutForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = {
				user_id: this.user_id,
				plan_id: this.plan_id,
				plan_type: this.plan_type,
				stripe_token: stripe_token
			};
			this.httpClientService.post("user-subscriptions/add", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo("login");
				}
				else {
					self.httpClientService.showError(res.message);
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			} );
		}
		else {
			this.httpClientService.showLoader = false;
		}
	}
}
