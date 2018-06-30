import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserComparisonComponent } from './user-comparison/user-comparison.component';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { LineGraphComponent } from './widgets/line-graph/line-graph.component';
import { SalaryComponent } from './user-comparison/salary/salary.component';
import { AppRoutingModule } from './/app-routing.module';
import { SalaryTopCompanyComponent } from './user-comparison/salary/salary-top-company.component';
import { YourCurrentStatusComponent } from './user-comparison/salary/your-current-status.component';
import { GaugeComponent } from './widgets/gauge/gauge.component';
import { CompaniesComponent } from './user-comparison/skillsAndTechnology/companies.component';
import { PieChartComponent } from './widgets/pie-chart/pie-chart.component';
import { HttpClientModule }    from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserDetailsComponent,
    UserComparisonComponent,
    SelectCompanyComponent,
    LineGraphComponent,
    SalaryComponent,
    SalaryTopCompanyComponent,
    YourCurrentStatusComponent,
    GaugeComponent,
    CompaniesComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
