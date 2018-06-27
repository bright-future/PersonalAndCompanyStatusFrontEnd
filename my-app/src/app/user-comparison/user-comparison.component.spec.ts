import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComparisonComponent } from './user-comparison.component';

describe('UserComparisonComponent', () => {
  let component: UserComparisonComponent;
  let fixture: ComponentFixture<UserComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
