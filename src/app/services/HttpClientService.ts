import {Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import * as moment from 'moment';

@Injectable()
export class HttpClientService {
  private projectPath:string = "http://localhost:3000/";
  // private projectPath:string = "https://test.cleata.com/";
  // private projectPath:string = "http://217.160.250.254/";
  // private projectPath:string = "http://cleata.projectstatus.in:3005/";
  public serviceBase:string = this.projectPath+"api/";
  public imageUrl:string = this.projectPath+"public/uploads/";
  public defaltDate:string = "dd MMM yyyy, h:mm aaa";
  public excelDateFormat:string = "DD/MM/YYYY";
  public authorization:string;
  public device_type:string = "a";
  public device_id:string;
  public errorMessage:string = "Oops! Something went wrong!";
  public userData:any = null;
  public showLoader:boolean = false;
  public progressLoadingShow:boolean = false;  
  public progressLoadingValue:number = 0;
  public hashURLActive:string = "";
  public settings:any = null;
  public homePageData:any;
  public homePagePlans:any;
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    var userData = JSON.parse(localStorage.getItem("user"));
    // console.log("userData ssf", userData);
    if (!userData) {
      this.getHomePages();
      this.getPlans();
    }
    this.getSettings();
  }

  getHomePages(){
    var self = this;
    this.get("pages/home").subscribe(function(res:any){
      if (!res.error) {
        self.homePageData = res.data;
      }
    }
    , error => {
    });
  }

  getSettings(){
    var self = this;
    this.get("setting/view").subscribe(function(res:any){
      if (!res.settings) {
        self.settings = res.data;
      }
    }
    , error => {
    });
  }

  getPlans(){
    var self = this;
    this.get('plans').subscribe(function(res:any){
      if(!res.error){
        self.homePagePlans = res.data;
      } else{
        self.showError(res.message);
      }
    });
  }

  createAuthorizationHeader(httpOptions) {
    var userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      this.authorization = userData.token;
      httpOptions.headers = httpOptions.headers.set('Authorization', this.authorization);
    }
    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  showInfo(message) {
    this.toastr.info(message);
  }

  showWarning(message) {
    this.toastr.warning(message);
  }
  
  get(url) {
      const httpOptions = { headers: new HttpHeaders()};
      this.createAuthorizationHeader(httpOptions);
      return this.http.get(this.serviceBase+url, httpOptions);
  }
  post(url, data) {
    const httpOptions = { headers: new HttpHeaders()};
    this.createAuthorizationHeader(httpOptions);
    return this.http.post(this.serviceBase+url, data, httpOptions);
  }

  getAverageTime(average_time_minute) {
    var minutes = Math.floor(average_time_minute);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);
    // hours = hours-(days*24);
    // minutes = minutes-(days*24*60)-(hours*60);
    minutes = minutes-(hours*60);

    var return_data = (hours ? hours+" Hr(s) " : "") + minutes+" Min(s)";
    return return_data;
  }

  setDataAccording(data) {
    var converted_date_value = moment(data).format(this.excelDateFormat);
    if (typeof data == "string" && converted_date_value != "Invalid date") {
      data = converted_date_value;
    }
    return data;
  }

  goTo(page) {
    this.router.navigate([page]);
  }

  parseInt(num) {
    return parseInt(num);
  }

  numberToLetter(n) {
      var ordA = 'a'.charCodeAt(0);
      var ordZ = 'z'.charCodeAt(0);
      var len = ordZ - ordA + 1;
    
      var s = "";
      while(n >= 0) {
          s = String.fromCharCode(n % len + ordA) + s;
          n = Math.floor(n / len) - 1;
      }
      return s.toUpperCase();
  }
}