import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtfimmesComponent } from './dtfimmes.component';

describe('DtfimmesComponent', () => {
  let component: DtfimmesComponent;
  let fixture: ComponentFixture<DtfimmesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtfimmesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtfimmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
