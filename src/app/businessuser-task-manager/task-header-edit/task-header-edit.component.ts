import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClientService } from '../../services/HttpClientService';
import { BaseClass } from '../../services/BaseClass';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-header-edit',
  templateUrl: './task-header-edit.component.html',
  styleUrls: ['./task-header-edit.component.css']
})
export class BusinessTaskHeadereditComponent implements OnInit {
  public task_id: string;
  public taskData: any;
  submitted: boolean = false;
  taskHeaderForm: FormGroup;
  constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, private fb: FormBuilder) {
    this.task_id = route.snapshot.params.id;
    this.taskHeaderForm = fb.group({
			id: ['',[Validators.required]],
			headers: new FormArray([])
  })
}

  ngOnInit(): void {
    let self = this;
    setTimeout(function () {
      self.getTask();
    }, 200);
  }

  get f() { return this.taskHeaderForm.controls; }
  get t() { return this.f.headers as FormArray; }

  updateTaskHeader() {
    var self = this;
    console.log("this.taskHeaderForm", this.taskHeaderForm);
    this.submitted = true;
    if (this.taskHeaderForm.valid) {
      this.httpClientService.post("tasks/updateheader", this.taskHeaderForm.value).subscribe(function (res: any) {
        if (!res.error) {
          self.httpClientService.showSuccess(res.message);
          console.log(res.data)
          self.httpClientService.goTo('jobs/rule/'+self.task_id);
        }
        else {
          self.httpClientService.showError(res.message);
        }
      }
        , error => {
          self.httpClientService.showError(self.httpClientService.errorMessage);
        });
    }
  }

  getTask() {
    var self = this;
    this.httpClientService.showLoader = true;
    this.httpClientService.get("task/view/" + this.task_id).subscribe(function (res: any) {
      self.httpClientService.showLoader = false;
      console.log(res.data)
      if (!res.error) {
        self.taskData = res.data.task_detail;
        for (let i = 0; i < self.taskData.task_header.length; i++) {
          self.t.push(self.fb.group({
              name: ["", [Validators.required, , Validators.maxLength(50)]]
          }));
      }
        self.taskHeaderForm.patchValue({
					id: self.taskData._id,
					task_header: self.taskData.task_header
        });
      }
      else {
      }
    }, error => {
      self.httpClientService.showLoader = false;
      self.httpClientService.showError(self.httpClientService.errorMessage);
    });
  }

}
