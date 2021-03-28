import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
	submitted:boolean = false;
	contactForm: FormGroup;
	public userData: any;
	constructor(public httpClientService: HttpClientService, private fb: FormBuilder) {
		this.userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
		this.contactForm = fb.group({
			name: [(this.userData ? this.userData.full_name : ""), [Validators.required, Validators.maxLength(50)]],
			email: [(this.userData ? this.userData.email : ""), [Validators.required, Validators.email, Validators.maxLength(100)]],
			mobile: [(this.userData ? this.userData.mobile : ""), [customValidationService.checkLimit(1, 15)]],
			description: ["", [Validators.required, Validators.maxLength(1000)]]
	    });
	}

	ngOnInit(): void {
	}

	get f() { return this.contactForm.controls; }

	saveContactDetail() {
		var self = this;
		this.submitted = true;
		if (this.contactForm.valid) {
			this.httpClientService.showLoader = true;
			var sendRequestData = this.contactForm.value;
			this.httpClientService.post("contact/add", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.contactForm.reset();
					self.submitted = false;
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