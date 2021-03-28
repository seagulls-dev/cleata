import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '../../services/HttpClientService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<object>;
  constructor(private authService: AuthService, public httpClientService: HttpClientService) { }

  ngOnInit(): void {
  	this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  onLogout(){
    this.authService.logout();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

}
