import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from '../helpers/must-match.validator';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
	submitted:boolean = false;
	resetPassForm: FormGroup;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder, private route: ActivatedRoute) {
		this.resetPassForm = fb.group({
			token: [route.snapshot.params.token],
			password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
			repassword: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
	    }, {
            validator: MustMatch('password', 'repassword')
        });
	}

	ngOnInit(): void {
	}

	get f() { return this.resetPassForm.controls; }

	resetPassword() {
		var self = this;
		this.submitted = true;
		if (this.resetPassForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.resetPassForm.value;
			this.httpClientService.post("reset-password", sendRequestData).subscribe(function(res:any){
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
	}
}
