import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../auth/auth.service';
import { MustMatch } from '../helpers/must-match.validator';
import { ActivatedRoute } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
declare var $: any;
declare var Stripe;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	submitted:boolean = false;
	signupForm: FormGroup;
	plan_type:string;
	plan_id:string;
	stripe:any;
	public countiresData: Array<Select2OptionData>;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
		this.plan_type = route.snapshot.params.plan_type;
		this.plan_id = route.snapshot.params.plan_id;
		this.signupForm = fb.group({
			first_name: ["", [Validators.required, Validators.maxLength(100)]],
			last_name: ["", [Validators.required, Validators.maxLength(100)]],
			country: ["", [Validators.required]],
			company_name: ["", [Validators.required, Validators.maxLength(100)]],
			mobile: ["", [Validators.required, customValidationService.checkLimit(1, 15)]],
			profile_picture: [""],
			role: ["business_user", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
			repassword: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
			term_of_use: [false, [Validators.required]],
			plan_type: [this.plan_type, [Validators.required]],
			plan_id: [this.plan_id, [Validators.required]],
	    }, {
            validator: MustMatch('password', 'repassword')
        });
	}

	ngOnInit(): void {
		this.stripe = Stripe('pk_test_F4jQ56jAC9MkBSHYMsCNCAXJ00CBKwzwHJ');
		let self = this;
		setTimeout(function() {
			self.getCountries();
		}, 200);
	}

	getCountries() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("countries").subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				var countiresData = [];
				for (var i = 0; i < res.data.length; i++) {
					countiresData.push({id: res.data[i]._id, text: res.data[i].name});
				}
				self.countiresData = countiresData;
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

	get f() { return this.signupForm.controls; }

	signupUser() {
		var self = this;
		this.submitted = true;
		if (this.signupForm.valid && this.signupForm.value.term_of_use) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.signupForm.value;
			this.httpClientService.post("register", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					if (res.data.isFree) {
						self.httpClientService.goTo("login");
					}
					else {
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
					
					// self.httpClientService.goTo("signup/checkout/"+self.plan_type+"/"+self.plan_id+"/"+res.data.user_id);
					// self.authService.setSessionData(res.data);
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


import { AbstractControl, ValidatorFn } from '@angular/forms';
export class customValidationService {
   static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } | null => {
        if ((c.value !== "" && c.value !== null) && (isNaN(c.value) || c.value < min || c.value.toString().length > max)) {
        	if (c.value ==0 || c.value < min) {
        		return { range: {requiredMinLength: min} };
        	}
        	else if(c.value.toString().length > max) {
        		return { range: {requiredMaxLength: max} };
        	}
        }
        return null;
    };
  }
}