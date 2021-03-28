import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ContactusComponent } from './contactus/contactus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { TeamlistComponent } from './team-manager/teamlist/teamlist.component';
import { TeamviewComponent } from './team-manager/teamview/teamview.component';
import { TeamaddComponent } from './team-manager/teamadd/teamadd.component';
import { TeameditComponent } from './team-manager/teamedit/teamedit.component';
import { TeamuserlistComponent } from './teamuser-manager/teamuserlist/teamuserlist.component';
import { TeamuseraddComponent } from './teamuser-manager/teamuseradd/teamuseradd.component';
import { TeamusereditComponent } from './teamuser-manager/teamuseredit/teamuseredit.component';
import { TeamuserviewComponent } from './teamuser-manager/teamuserview/teamuserview.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { PagesComponent } from './pages/pages.component';
import { RegistercheckoutComponent } from './registercheckout/registercheckout.component';
import { UpgradeplanComponent } from './upgradeplan/upgradeplan.component';
import { UpgradecheckoutComponent } from './upgradecheckout/upgradecheckout.component';
import { BusinessTasklistComponent } from './businessuser-task-manager/tasklist/tasklist.component';
import { BusinessTaskviewComponent } from './businessuser-task-manager/taskview/taskview.component';
import { BusinessTaskaddComponent } from './businessuser-task-manager/taskadd/taskadd.component';
import { BusinessTaskeditComponent } from './businessuser-task-manager/taskedit/taskedit.component';
import { UncategorizedtasklistComponent } from './businessuser-task-manager/uncategorizedtasklist/uncategorizedtasklist.component';
import { UncategorizedtaskviewComponent } from './businessuser-task-manager/uncategorizedtaskview/uncategorizedtaskview.component';
import { TasklistComponent } from './teamuser-task-manager/tasklist/tasklist.component';
import { TaskviewComponent } from './teamuser-task-manager/taskview/taskview.component';
import { TaskviewformComponent } from './teamuser-task-manager/taskviewform/taskviewform.component';
import { TaskaddComponent } from './teamuser-task-manager/taskadd/taskadd.component';
import { TaskpermissionsaddComponent } from './task-permissions-manager/taskpermissionsadd/taskpermissionsadd.component';
import { BusinessTaskHeadereditComponent } from './businessuser-task-manager/task-header-edit/task-header-edit.component';
import { TaskrulesaddComponent } from './taskrulesadd/taskrulesadd.component';
import { TeamuserDashboardComponent } from './teamuser-dashboard/teamuser-dashboard.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PlanlimitexceededComponent } from './task-add-steps/planlimitexceeded/planlimitexceeded.component';
import { PaymentconfirmationloginComponent } from './paymentconfirmationlogin/paymentconfirmationlogin.component';
import { PlanSummaryComponent } from './plan-summary/plan-summary.component';
import { PaymentconfirmationComponent } from './paymentconfirmation/paymentconfirmation.component';
import { DoesheaderComponent } from './task-add-steps/doesheader/doesheader.component';
import { UpgradepaymentconfirmationComponent } from './upgradepaymentconfirmation/upgradepaymentconfirmation.component';
import { AssignheaderComponent } from './task-add-steps/assignheader/assignheader.component';
import { AssigndatatypeComponent } from './task-add-steps/assigndatatype/assigndatatype.component';
import { MissmatchdatatypeComponent } from './task-add-steps/missmatchdatatype/missmatchdatatype.component';
import { AllocateteamComponent } from './task-add-steps/allocateteam/allocateteam.component';
import { ConfigurecolumnpermissionsComponent } from './task-add-steps/configurecolumnpermissions/configurecolumnpermissions.component';
import { ConflictcolumnpermissionsComponent } from './task-add-steps/conflictcolumnpermissions/conflictcolumnpermissions.component';
import { ReallocatetasksComponent } from './task-add-steps/reallocatetasks/reallocatetasks.component';
import { WantconfigurebusinessrulesComponent } from './task-add-steps/wantconfigurebusinessrules/wantconfigurebusinessrules.component';
import { ConfigurebusinessrulesComponent } from './task-add-steps/configurebusinessrules/configurebusinessrules.component';
import { ReviewmatchingdataComponent } from './task-add-steps/reviewmatchingdata/reviewmatchingdata.component';
import { UncategorizedresulttoteamsComponent } from './task-add-steps/uncategorizedresulttoteams/uncategorizedresulttoteams.component';

import { SetstartdateComponent } from './task-add-steps/setstartdate/setstartdate.component';
import { SetcompletedateComponent } from './task-add-steps/setcompletedate/setcompletedate.component';
import { UserassignmentpolicyComponent } from './task-add-steps/userassignmentpolicy/userassignmentpolicy.component';
import { JobsummaryComponent } from './task-add-steps/jobsummary/jobsummary.component';
import { ReportformComponent } from './reportform/reportform.component';
const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'page/:slug', component: PagesComponent },
	{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
	// { path: 'payment/:stripe_callback', component: PaymentconfirmationloginComponent },
	{ path: 'payment/:stripe_callback/:stripe_session_id', component: PaymentconfirmationloginComponent },
	{ path: 'auth-payment/:stripe_callback/:stripe_session_id', component: PaymentconfirmationComponent, canActivate: [AuthGuard] },
	{ path: 'auth-payment/:stripe_callback/:stripe_session_id', component: PaymentconfirmationComponent, canActivate: [AuthGuard] },
	{ path: 'auth-payment/upgrade/success', component: UpgradepaymentconfirmationComponent, canActivate: [AuthGuard] },
	{ path: 'auth-payment/upgrade/success/:task_id', component: UpgradepaymentconfirmationComponent, canActivate: [AuthGuard] },
	// { path: 'auth-payment/:stripe_callback/:stripe_session_id/tasks/:task_id', component: PaymentconfirmationComponent, canActivate: [AuthGuard] },
	// { path: 'auth-payment/:stripe_callback/:stripe_session_id/tasks/:task_id', component: PaymentconfirmationComponent, canActivate: [AuthGuard] },
	{ path: 'signup/:plan_type/:plan_id', component: SignupComponent, canActivate: [AuthGuard] },
	{ path: 'signup/checkout/:plan_type/:plan_id/:user_id', component: RegistercheckoutComponent, canActivate: [AuthGuard] },
	{ path: 'forgot-password', component: ForgotpasswordComponent, canActivate: [AuthGuard] },
	{ path: 'reset-password/:token', component: ResetpasswordComponent, canActivate: [AuthGuard] },
	{ path: 'email-verify/:token', component: VerifyemailComponent, canActivate: [AuthGuard] },
	{ path: 'contactus', component: ContactusComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard/:stripe_callback/:stripe_session_id', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard/teamuser', component: TeamuserDashboardComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'changepassword', component: ChangepasswordComponent, canActivate: [AuthGuard] },
	{ path: 'teams', component: TeamlistComponent, canActivate: [AuthGuard] },
	{ path: 'teams/add', component: TeamaddComponent, canActivate: [AuthGuard] },
	{ path: 'teams/view/:id', component: TeamviewComponent, canActivate: [AuthGuard] },
	{ path: 'teams/edit/:id', component: TeameditComponent, canActivate: [AuthGuard] },

	{ path: 'teamusers', component: TeamuserlistComponent, canActivate: [AuthGuard] },
	{ path: 'teamusers/add', component: TeamuseraddComponent, canActivate: [AuthGuard] },
	{ path: 'teamusers/view/:id', component: TeamuserviewComponent, canActivate: [AuthGuard] },
	{ path: 'teamusers/edit/:id', component: TeamusereditComponent, canActivate: [AuthGuard] },
	{ path: 'upgradeplan', component: UpgradeplanComponent, canActivate: [AuthGuard] },
	{ path: 'upgradeplan/tasks/:task_id', component: UpgradeplanComponent, canActivate: [AuthGuard] },
	{ path: 'upgradeplan/:stripe_callback', component: UpgradeplanComponent, canActivate: [AuthGuard] },
	{ path: 'upgradeplan/checkout/:plan_type/:plan_id', component: UpgradecheckoutComponent, canActivate: [AuthGuard] },
	{ path: 'tasks', component: TasklistComponent, canActivate: [AuthGuard] },
	
	{ path: 'tasks/view/:id', component: TaskviewComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/form/view/:id', component: TaskviewformComponent, canActivate: [AuthGuard] },
	// Task Add steps
	{ path: 'tasks/add', component: TaskaddComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/limitexceeded/:task_id', component: PlanlimitexceededComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/doesheader/:task_id', component: DoesheaderComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/assignheader/:task_id', component: AssignheaderComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/assigndatatype/:task_id', component: AssigndatatypeComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/missmatchdatatype/:task_id', component: MissmatchdatatypeComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/allocateteam/:task_id', component: AllocateteamComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/configurecolumnpermissions/:task_id', component: ConfigurecolumnpermissionsComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/conflictcolumnpermissions/:task_id', component: ConflictcolumnpermissionsComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/reallocatetasks/:task_id', component: ReallocatetasksComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/wantconfigurebusinessrules/:task_id', component: WantconfigurebusinessrulesComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/configurebusinessrules/:task_id', component: ConfigurebusinessrulesComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/reviewmatchingdata/:task_id', component: ReviewmatchingdataComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/uncategorizedresulttoteams/:task_id', component: UncategorizedresulttoteamsComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/setstartdate/:task_id', component: SetstartdateComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/setcompletedate/:task_id', component: SetcompletedateComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/userassignmentpolicy/:task_id', component: UserassignmentpolicyComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/jobsummary/:task_id', component: JobsummaryComponent, canActivate: [AuthGuard] },
	// { path: 'tasks/edit/:id', component: TeameditComponent, canActivate: [AuthGuard] },

	{ path: 'taskpermissions/add/:id', component: TaskpermissionsaddComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/tasks', component: BusinessTasklistComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/tasks/add', component: BusinessTaskaddComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/tasks/edit/:id', component: BusinessTaskeditComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/tasks-header/edit/:id', component: BusinessTaskHeadereditComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/tasks/view/:id', component: BusinessTaskviewComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/uncategorizedtasks', component: UncategorizedtasklistComponent, canActivate: [AuthGuard] },
	{ path: 'business-user/uncategorizedtasks/view/:id', component: UncategorizedtaskviewComponent, canActivate: [AuthGuard] },
	{ path: 'jobs/rule/:task_id', component: TaskrulesaddComponent, canActivate: [AuthGuard] },
	{ path: 'plan-summary/:plan_type/:plan_id', component: PlanSummaryComponent, canActivate: [AuthGuard] },
	{ path: 'plan-summary/:plan_type/:plan_id/:task_id', component: PlanSummaryComponent, canActivate: [AuthGuard] },
	{ path: 'reports', component: ReportformComponent, canActivate: [AuthGuard] },
];
// reset-password
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
