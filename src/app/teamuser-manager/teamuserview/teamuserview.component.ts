import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teamuserview',
  templateUrl: './teamuserview.component.html',
  styleUrls: ['./teamuserview.component.css']
})
export class TeamuserviewComponent implements OnInit {
	public teamuser_id:string;
	public teamUserData:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.teamuser_id = route.snapshot.params.id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeamUser();
		}, 200);
	}

	getTeamUser() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teamusers/view/"+this.teamuser_id).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamUserData = res.data;
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
