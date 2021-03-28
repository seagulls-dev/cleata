import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	// public homePageData:any;
	// public plans: any;
	constructor(public httpClientService: HttpClientService, private sanitized: DomSanitizer){
		// this.getHomePages();
		// this.getPlans();
	}

  ngOnInit(): void {
  }

 //  getHomePages(){
	// 	var self = this;
	// 	this.httpClientService.get("pages/home").subscribe(function(res:any){
	// 		if (!res.error) {
	// 			self.homePageData = res.data;
	// 		}
	// 		else {
	// 			// self.httpClientService.showError(res.message);
	// 		}
	// 	}
	// 	, error => {
	// 		// self.httpClientService.showError(self.httpClientService.errorMessage);
	// 	});
	// }

	// getPlans(){
	// 	var self = this;
	// 	this.httpClientService.get('plans').subscribe(function(res:any){
	// 		if(!res.error){
	// 			self.plans = res.data;
	// 		} else{
	// 			self.httpClientService.showError(res.message);
	// 		}
	// 	});
	// }


}
