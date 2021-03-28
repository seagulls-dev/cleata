import { Component } from '@angular/core';
import { HttpClientService } from './services/HttpClientService';
import { Router, Event, NavigationEnd, Scroll } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(public httpClientService: HttpClientService, private router: Router) {
		this.router.events.subscribe((event: Event) => {
	        if (event instanceof NavigationEnd) {
	        	if (event.url.indexOf('#howitwork') !== -1) {
		            this.httpClientService.hashURLActive = 'howitwork';
		            $("#home-link").removeClass("active");
		            this.scrollToViewPoint("howitwork");
		        } else if (event.url.indexOf('#whatiscleata') !== -1) {
		            this.httpClientService.hashURLActive = 'whatiscleata';
		            $("#home-link").removeClass("active");
		            this.scrollToViewPoint("whatiscleata");
		        } else if (event.url.indexOf('#pricing') !== -1) {
		            this.httpClientService.hashURLActive = 'pricing';
		            $("#home-link").removeClass("active");
		            this.scrollToViewPoint("pricing");
		        } else {
		            this.httpClientService.hashURLActive = '';
		        }
	        	if ($("#navbarNav").hasClass("show")) {
	        		$("#nav-menus").click();
	        	}
            }
	    });
	}

	scrollToViewPoint(id) {
		const yOffset = -63; 
		const element = document.getElementById(id);
        setTimeout(function() {
			const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({top: y});
        }, 10);
	}
}
