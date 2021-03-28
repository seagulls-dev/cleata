import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { HttpClientService } from '../services/HttpClientService';

@Injectable()
export class AuthService {
  public loggedIn = new BehaviorSubject<Object>(JSON.parse(localStorage.getItem("user")));

  constructor(private router: Router, public  httpClientService: HttpClientService) {

  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(user: User){
  	var self = this;
    if (user.email !== '' && user.password != '' ) {
    	var sendRequestData = user;
    	this.httpClientService.showLoader = true;
    	this.httpClientService.post(user.loginAPI, sendRequestData).subscribe(function(res:any){
  			self.httpClientService.showLoader = false;
  			if (!res.error) {
          if(user.rememberMe){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('password', user.password);
            localStorage.setItem('rememberMe', JSON.stringify(user.rememberMe));
          }
          // res.data.role = user.role;
          self.httpClientService.showSuccess(res.message);
  				self.setSessionData(res.data);
          // if (user.role=="cinemacashier") {
          //   self.router.navigate(['/'+user.role+"/0"]);
          // }
          // else {
          //   self.router.navigate(['/'+user.role]);
          // }
          
  			}
  			else {
  				self.httpClientService.showError(res.message);
  			}
  		}
  		, error => {self.httpClientService.showLoader = false;self.httpClientService.showError(self.httpClientService.errorMessage);} );
    }
  }

  setSessionData(data) {
    localStorage.setItem("user", JSON.stringify(data));
    this.loggedIn.next(data);
    if(data.role == 'team_user'){
      this.httpClientService.goTo("dashboard/teamuser");
    }else{
      this.httpClientService.goTo("dashboard");
    }
  }

  logout() {
    var userData = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("user");
    // localStorage.removeItem('token');
    // localStorage.removeItem('email');
    // localStorage.removeItem('password');
    // localStorage.removeItem('rememberMe');
    this.loggedIn.next(null);
    this.httpClientService.getHomePages();
    this.httpClientService.getPlans();
    this.httpClientService.goTo('');
  }
}
