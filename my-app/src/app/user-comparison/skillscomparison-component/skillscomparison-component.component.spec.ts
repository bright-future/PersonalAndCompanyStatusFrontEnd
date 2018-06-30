import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillscomparisonComponentComponent } from './skillscomparison-component.component';

describe('SkillscomparisonComponentComponent', () => {
  let component: SkillscomparisonComponentComponent;
  let fixture: ComponentFixture<SkillscomparisonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillscomparisonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillscomparisonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
