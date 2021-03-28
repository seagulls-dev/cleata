import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upgradepaymentconfirmation',
  templateUrl: './upgradepaymentconfirmation.component.html',
  styleUrls: ['./upgradepaymentconfirmation.component.css']
})
export class UpgradepaymentconfirmationComponent implements OnInit {
	task_id:string;
	constructor(public httpClientService: HttpClientService, private route: ActivatedRoute) {
		if (typeof route.snapshot.params.task_id != "undefined" && route.snapshot.params.task_id) {
			this.task_id = route.snapshot.params.task_id;
		}
	}

	ngOnInit(): void {
	}

	goContinue() {
		var back_url = "dashboard";
		if (this.task_id) {
			back_url = "tasks/doesheader/"+this.task_id;
		}
		this.httpClientService.goTo(back_url);
	}
}
