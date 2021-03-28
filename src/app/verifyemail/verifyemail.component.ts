import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent implements OnInit {
	private token:string;
	constructor(public httpClientService: HttpClientService, private route: ActivatedRoute) {
		this.token = route.snapshot.params.token;
	}

	ngOnInit(): void {
		var self = this;
		setTimeout(function() {
			self.verifyEmailNow();
		}, 200);
	}

 	verifyEmailNow() {
		var self = this;
		if (this.token) {
			this.httpClientService.showLoader = true;
			var sendRequestData = {token: this.token};
			this.httpClientService.post("verify-email", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo("login");
				}
				else {
					self.httpClientService.showError("Invalid token");
					self.httpClientService.goTo("login");
				}
			}
			, error => {
				self.httpClientService.showLoader = false;
				self.httpClientService.showError(self.httpClientService.errorMessage);
			} );
		}
		else {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError("Invalid token");
			self.httpClientService.goTo("login");
		}
	}

}
