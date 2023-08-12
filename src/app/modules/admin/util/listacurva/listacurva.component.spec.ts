import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacurvaComponent } from './listacurva.component';

describe('ListacurvaComponent', () => {
  let component: ListacurvaComponent;
  let fixture: ComponentFixture<ListacurvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListacurvaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListacurvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
