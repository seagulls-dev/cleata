import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { PaginationClass } from '../../services/PaginationClass';

@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.css']
})
export class TeamlistComponent extends PaginationClass implements OnInit {
	public teamsData: any;
	public searchKeyword:string = "";
	public currentCount:number = 0;
	constructor(public httpClientService: HttpClientService) {
		super();
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeams();
		}, 200);
	}

	searchByKeyword() {
		this.activePage = 1;
		this.gotoFirst();
	}

	hitApi(){
	    this.getTeams();
	}

  	getTeams() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teams"+this.pageUrl+"&q="+this.searchKeyword).subscribe(function(res:any){
			self.httpClientService.showLoader = false;
			self.setPagination({count: res.data.count, perPage: res.data.perPage});
			if (!res.error) {
				self.teamsData = res.data;
				self.currentCount = res.data.result.length;
			}
			else {
				self.currentCount = 0;
				self.teamsData = null;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	deleteTeam(index) {
		if (confirm("Are you sure you want to delete this record?")) {
			var self = this;
			this.httpClientService.showLoader = true;
			this.httpClientService.get("teams/delete/"+this.teamsData.result[index]._id).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.teamsData.result.splice(index, 1);
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
