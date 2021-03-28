import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PagesComponent implements OnInit {
	public slug:string;
	public cmsPageData:any;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, private router: Router,private sanitized: DomSanitizer) {
		this.slug = this.route.snapshot.params.slug;
		this.getCmsPage();
		
	}

	ngOnInit(): void {
		let self = this;
		setTimeout(function() {
			self.router.events.subscribe((event: Event) => {
		        if (event instanceof NavigationEnd) {
		        	self.slug = self.route.snapshot.params.slug;
					self.getCmsPage();
				}
	    	});
		}, 200);
	}

	getCmsPage() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("pages/view/"+this.slug).subscribe(function(res:any){
			console.log("res", res);
			self.httpClientService.showLoader = false;
			if (!res.error) {
				self.cmsPageData = res.data;
				// self.cmsPageData.content = self.transform(self.cmsPageData.content);
			}
			else {
				self.cmsPageData = null;
				self.httpClientService.showError(res.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	transform(value) {
		return this.sanitized.bypassSecurityTrustStyle(value);
	}

}
