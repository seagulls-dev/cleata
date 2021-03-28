import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teamview',
  templateUrl: './teamview.component.html',
  styleUrls: ['./teamview.component.css']
})
export class TeamviewComponent implements OnInit {
	public team_id:string;
	public teamData:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
		this.team_id = route.snapshot.params.id;
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeam();
		}, 200);
	}

	getTeam() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teams/view/"+this.team_id).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.teamData = res.data;
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
