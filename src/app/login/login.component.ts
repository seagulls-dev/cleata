import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	submitted:boolean = false;
	loginForm: FormGroup;
	// rememberMe: boolean;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
		var stripe_callback = route.snapshot.params.stripe_callback;
		var stripe_session_id = route.snapshot.params.stripe_session_id;
		if (stripe_callback == "cancel") {
			this.httpClientService.showError("Transaction failed! Please verify your account first to continue use free plan.");
		}
		else if(stripe_callback == "success" && stripe_session_id) {
			this.subscriptionAddCheckout(stripe_session_id);
		}
		this.loginForm = fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
			loginAPI: ['login'],
			rememberMe: [false]
	    });
	}

	subscriptionAddCheckout(stripe_session_id) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("user-subscriptions/addcheckout", {stripe_session_id: stripe_session_id}).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.httpClientService.showSuccess(res.message);
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

	ngOnInit(): void {
		if(localStorage.getItem('rememberMe') !== null && localStorage.getItem('token') !==null){
			// console.log("ffe", localStorage.getItem('email'));
			this.loginForm = this.fb.group({
				email: [localStorage.getItem('email'), [Validators.required, Validators.email]],
				password: [localStorage.getItem('password'), [Validators.required]],
				loginAPI: ['login'],
				token: [localStorage.getItem('token')],
				rememberMe: [true]
			});
		}
	}

	get f() { return this.loginForm.controls; }

	loginUser() {
		var self = this;
		this.submitted = true;
		if (this.loginForm.valid) {
			// this.httpClientService.showLoader = true;
			// var sendRequestData = this.loginForm.value;
			// console.log("sendRequestData", sendRequestData);
			// this.httpClientService.post("login", sendRequestData).subscribe(function(res:any){
			// 	self.httpClientService.showLoader = false;
			// 	if (!res.error) {
			// 		self.httpClientService.goTo("dashboard");
			// 	}
			// 	else {
			// 		alert(res.message);
			// 	}
			// }
			// , error => {
			// 	self.httpClientService.showLoader = false;
			// 	console.log("error", error);
			// } );
			this.authService.login(this.loginForm.value);
		}
	}
}