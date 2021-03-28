import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '../../services/HttpClientService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	isLoggedIn$: Observable<object>;
	constructor(public httpClientService: HttpClientService, private authService: AuthService) { }

	ngOnInit(): void {
		this.isLoggedIn$ = this.authService.isLoggedIn;
	}

	scrollToTop() {
		window.scrollTo(0, 0);
	}

}
