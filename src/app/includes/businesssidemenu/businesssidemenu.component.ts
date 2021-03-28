import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-businesssidemenu',
  templateUrl: './businesssidemenu.component.html',
  styleUrls: ['./businesssidemenu.component.css']
})
export class BusinesssidemenuComponent implements OnInit {
	isLoggedIn$: Observable<object>;
	constructor(public authService: AuthService) { }

	ngOnInit(): void {
		this.isLoggedIn$ = this.authService.isLoggedIn;
	}

}
