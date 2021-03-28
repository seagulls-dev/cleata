import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { PaginationClass } from '../../services/PaginationClass';

@Component({
  selector: 'app-teamuserlist',
  templateUrl: './teamuserlist.component.html',
  styleUrls: ['./teamuserlist.component.css']
})
export class TeamuserlistComponent extends PaginationClass implements OnInit {
 	public teamuUsersData: any;
	public searchKeyword:string = "";
	public currentCount:number = 0;
	constructor(public httpClientService: HttpClientService) {
		super();
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.getTeamUsers();
		}, 200);
	}

	searchByKeyword() {
		this.activePage = 1;
		this.gotoFirst();
	}

	hitApi(){
	    this.getTeamUsers();
	}

	getTeamUsers() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("teamusers"+this.pageUrl+"&q="+this.searchKeyword).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			self.setPagination({count: res.data.count, perPage: res.data.perPage});
			if (!res.error) {
				self.teamuUsersData = res.data;
				self.currentCount = res.data.result.length;
			}
			else {
				self.teamuUsersData = null;
				self.currentCount = 0;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	deleteTeamUser(index) {
		if (confirm("Are you sure you want to delete this record?")) {
			var self = this;
			this.httpClientService.showLoader = true;
			this.httpClientService.get("teamusers/delete/"+this.teamuUsersData.result[index]._id).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.teamuUsersData.result.splice(index, 1);
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
