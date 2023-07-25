import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectfilialComponent } from './selectfilial.component';

describe('SelectfilialComponent', () => {
  let component: SelectfilialComponent;
  let fixture: ComponentFixture<SelectfilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectfilialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectfilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
