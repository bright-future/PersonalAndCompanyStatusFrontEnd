import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCurrentStatusComponent } from './your-current-status.component';

describe('YourCurrentStatusComponent', () => {
  let component: YourCurrentStatusComponent;
  let fixture: ComponentFixture<YourCurrentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourCurrentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourCurrentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
