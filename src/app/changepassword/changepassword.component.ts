import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../helpers/must-match.validator';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
	submitted:boolean = false;
	changePasswordForm: FormGroup;
	public userData: any;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.userData = JSON.parse(localStorage.getItem("user"));
		this.changePasswordForm = fb.group({
			old_password: ["", [Validators.required]],
			password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
			repassword: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
	    }, {
            validator: MustMatch('password', 'repassword')
        });
	}

	get f() { return this.changePasswordForm.controls; }

	ngOnInit(): void {
	}

	saveChangePassword() {
		var self = this;
		this.submitted = true;
		console.log("this.changePasswordForm", this.changePasswordForm);
		if (this.changePasswordForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.changePasswordForm.value;
			this.httpClientService.post("change-password", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.submitted = false;
					self.changePasswordForm.reset();
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
	}

}
