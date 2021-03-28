import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from './services/HttpClientService';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelect2Module } from 'ng-select2';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxStripeModule } from 'ngx-stripe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
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
import { BusinesssidemenuComponent } from './includes/businesssidemenu/businesssidemenu.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { PagesComponent } from './pages/pages.component';
import { RegistercheckoutComponent } from './registercheckout/registercheckout.component';
import { UpgradeplanComponent } from './upgradeplan/upgradeplan.component';
import { UpgradecheckoutComponent } from './upgradecheckout/upgradecheckout.component';
import { BusinessTasklistComponent } from './businessuser-task-manager/tasklist/tasklist.component';
import { BusinessTaskviewComponent } from './businessuser-task-manager/taskview/taskview.component';
import { BusinessTaskaddComponent } from './businessuser-task-manager/taskadd/taskadd.component';
import { BusinessTaskeditComponent } from './businessuser-task-manager/taskedit/taskedit.component';
import { TaskpermissionsaddComponent } from './task-permissions-manager/taskpermissionsadd/taskpermissionsadd.component';
import { TasklistComponent } from './teamuser-task-manager/tasklist/tasklist.component';
import { TaskviewComponent } from './teamuser-task-manager/taskview/taskview.component';
import { TaskaddComponent } from './teamuser-task-manager/taskadd/taskadd.component';
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
import { UncategorizedtasklistComponent } from './businessuser-task-manager/uncategorizedtasklist/uncategorizedtasklist.component';
import { UncategorizedtaskviewComponent } from './businessuser-task-manager/uncategorizedtaskview/uncategorizedtaskview.component';
import { ReportformComponent } from './reportform/reportform.component';
import { TaskviewformComponent } from './teamuser-task-manager/taskviewform/taskviewform.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    ContactusComponent,
    DashboardComponent,
    ProfileComponent,
    TeamlistComponent,
    TeamviewComponent,
    TeamaddComponent,
    TeameditComponent,
    TeamuserlistComponent,
    TeamuseraddComponent,
    TeamusereditComponent,
    TeamuserviewComponent,
    BusinesssidemenuComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    VerifyemailComponent,
    PagesComponent,
    RegistercheckoutComponent,
    UpgradeplanComponent,
    UpgradecheckoutComponent,
    TaskrulesaddComponent,
    TasklistComponent,
    TaskviewComponent,
    TaskaddComponent,
    BusinessTaskeditComponent,
    BusinessTasklistComponent,
    BusinessTaskviewComponent,
    BusinessTaskaddComponent,
    TaskpermissionsaddComponent,
    BusinessTaskHeadereditComponent,
    TeamuserDashboardComponent,
    ChangepasswordComponent,
    PlanlimitexceededComponent,
    PaymentconfirmationloginComponent,
    PlanSummaryComponent,
    PaymentconfirmationComponent,
    DoesheaderComponent,
    UpgradepaymentconfirmationComponent,
    AssignheaderComponent,
    AssigndatatypeComponent,
    MissmatchdatatypeComponent,
    AllocateteamComponent,
    ConfigurecolumnpermissionsComponent,
    ConflictcolumnpermissionsComponent,
    ReallocatetasksComponent,
    WantconfigurebusinessrulesComponent,
    ConfigurebusinessrulesComponent,
    ReviewmatchingdataComponent,
    UncategorizedresulttoteamsComponent,
    SetstartdateComponent,
    SetcompletedateComponent,
    UserassignmentpolicyComponent,
    JobsummaryComponent,
    UncategorizedtasklistComponent,
    UncategorizedtaskviewComponent,
    ReportformComponent,
    TaskviewformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgSelect2Module,
    FileUploadModule,
    MatNativeDateModule,
    DragDropModule,
    MatInputModule,
    MatDatepickerModule,
    NgxStripeModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    HttpClientService,
    AuthService,
    AuthGuard,
    // {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
