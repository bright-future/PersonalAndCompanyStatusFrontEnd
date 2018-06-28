import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTopCompanyComponent } from './salary-top-company.component';

describe('SalaryTopCompanyComponent', () => {
  let component: SalaryTopCompanyComponent;
  let fixture: ComponentFixture<SalaryTopCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryTopCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryTopCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
