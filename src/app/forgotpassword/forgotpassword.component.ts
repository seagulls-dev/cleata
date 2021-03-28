import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
	submitted:boolean = false;
	forgotPassForm: FormGroup;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.forgotPassForm = fb.group({
			email: ["", [Validators.required, Validators.email]],
	    });
	}

	ngOnInit(): void {
	}

	get f() { return this.forgotPassForm.controls; }

	forgotUser() {
		var self = this;
		this.submitted = true;
		if (this.forgotPassForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.forgotPassForm.value;
			console.log("sendRequestData", sendRequestData);
			this.httpClientService.post("forgot-password", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.submitted = false;
					self.forgotPassForm.reset();
					self.httpClientService.showSuccess(res.message);
					// self.httpClientService.goTo("reset-password/"+res.data.reset_token);
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
	}
}
