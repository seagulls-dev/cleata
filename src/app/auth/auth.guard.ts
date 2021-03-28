import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { HttpClientService } from '../services/HttpClientService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, public  httpClientService: HttpClientService) {

  }

  getProfile(userOldData){
    var self = this;
    this.httpClientService.get("user-profile").subscribe(function(res:any){
      if (!res.error) {
        var userData = res.data;
        userData.token = userOldData.token;
        userData.plan_name = res.plan_name;
        userData.plan_type = res.plan_type;
        // var authService = AuthService();
        self.authService.loggedIn.next(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // self.homePageData = res.data;
      }
    }
    , error => {
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn
      .take(1)
      .map((isLoggedIn: object) => {
        var self = this;
        setTimeout(function() {
          var url = window.location.hash.split("/");
          var userData = JSON.parse(localStorage.getItem("user"));
          if (!url.length || !url[1] || (url[1]=="login" || url[1]=="signup" || url[1]=="forgot-password" || url[1]=="reset-password" || url[1]=="email-verify" || url[1]=="#whatiscleata" || url[1]=="#howitwork" || url[1]=="#pricing")) {
            if (isLoggedIn) {
              if (userData.role == "business_user") {
                self.router.navigate(['/dashboard']);
              }
              else {
                self.router.navigate(['/dashboard/teamuser']);
              }
            }
          }
          else {
            if (!isLoggedIn) {
              self.router.navigate(['/login']);
            }
          }

          if (isLoggedIn) {
            self.getProfile(userData);
          }
          return true;
          // if (isLoggedIn) {
          //   if ((url.length==2 && url[1] && url[1]!="login" && url[1]!="signup" && url[1]!="forgot-password" && url[1]!="reset-password" && url[1]!="email-verify")) {
          //     return true;
          //   }
          //   else {
          //     if (userData.role == "business_user") {
          //       self.router.navigate(['/dashboard']);
          //     }
          //     else {
          //       self.router.navigate(['/dashboard/teamuser']);
          //     }
          //     return true;
          //   }
            
          // }
          // self.router.navigate(['/login']);
          // return false;
          // if (url == "/" || url == "/forgot/admin" || url == "/forgot/cinemauser" || url == "/forgot/cinemacashier" || url == "/forgot/cinemakiosks" || url == "/cinemakiosks/login" || url == "/admin/login" || url == "/cinemauser/login" || url == "/cinemacashier/login" || url == "/cinemakiosks/login") {
          //   if (isLoggedIn) {
          //     if (userData.role == "admin") {
          //       self.router.navigate(['/admin']);
          //     }
          //     else if (userData.role == "cinemauser") {
          //       self.router.navigate(['/cinemauser']);
          //     }
          //     else if (userData.role == "cinemacashier") {
          //       self.router.navigate(['/cinemacashier/0']);
          //     }
          //     else if (userData.role == "cinemakiosks") {
          //       self.router.navigate(['/cinemakiosks/0']);
          //     }
          //     //return false;
          //   }
          //   else {
          //     // console.log("else", url);
          //     // self.router.navigate(['/admin/login']);
          //   }
          // }
          // else {
          //   if (!isLoggedIn){
          //     self.router.navigate(['']);
          //     return false;
          //   }
          //   else {
          //     var splitUrl = url.split("/");
          //     if (splitUrl[1]!="admin" && userData.role == "admin") {
          //       self.router.navigate(['/admin']);
          //     }
          //     else if(splitUrl[1]!="cinemauser" && userData.role == "cinemauser") {
          //       self.router.navigate(['/cinemauser']);
          //     }
          //     else if(splitUrl[1]!="cinemacashier" && userData.role == "cinemacashier") {
          //       self.router.navigate(['/cinemacashier/0']);
          //     }
          //     else if(splitUrl[1]!="cinemakiosks" && userData.role == "cinemakiosks") {
          //       self.router.navigate(['/cinemakiosks/0']);
          //     }
          //   }
          // }
        },10);
        
        return true;
    });
  }
}
