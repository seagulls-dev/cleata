import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taskpermissionsadd',
  templateUrl: './taskpermissionsadd.component.html',
  styleUrls: ['./taskpermissionsadd.component.css']
})
export class TaskpermissionsaddComponent implements OnInit {
  public task_id: string;
  public taskData: any;
  public teamsData: any;
  submitted:boolean = false;
  public teamPermissionObj = {
    team_id: '',
    permissions: []
  };
  public teamPermissionsArr = []
  constructor(private route: ActivatedRoute, public httpClientService: HttpClientService) {
    this.task_id = route.snapshot.params.id;
	}

  ngOnInit(): void {
    let self = this;
		setTimeout(function () {
      self.getTasks();
		}, 200);
  }

  getTasks() {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id).subscribe(function (res: any) {
			self.httpClientService.showLoader = false;
			if (!res.error) {
        self.taskData = res.data.task;
        self.getTeams();
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
  

   getTeams() {
    var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("activeteams").subscribe(function(res:any){
      self.httpClientService.showLoader = false;
			if (!res.error) {
        self.teamsData = res.data;
        if(self.taskData){
          for(var i=0; i<self.teamsData.length; i++){
            Object.assign(self.teamsData[i], {permissions: []});
            for(var j=0; j<self.taskData.task_header.length; j++){
              self.teamsData[i].permissions.push('EDIT')
            }
          }
        }
			}
			else {
				self.teamsData = null;
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
  }
  
	onPermissionChange(e, team, i){
    console.log(team)
    team.permissions[i]=e.target.value
    // console.log(team.permissions)
  }
  

  saveTaskPermissions() {
		var self = this;
		this.submitted = true;
      this.httpClientService.showLoader = true;
      self.teamsData.forEach(team => {
        self.teamPermissionObj = {
          team_id: team._id,
          permissions: team.permissions
        };
        this.teamPermissionsArr.push(self.teamPermissionObj);
      });
      var sendRequestData = {
        task_id: self.taskData._id,
        teamspermissions: this.teamPermissionsArr
      }
			this.httpClientService.post("taskpermissions/addupdate", sendRequestData).subscribe(function(res:any){
				self.httpClientService.showLoader = false;
				if (!res.error) {
					self.httpClientService.showSuccess(res.message);
					self.httpClientService.goTo("business-user/tasks");
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
