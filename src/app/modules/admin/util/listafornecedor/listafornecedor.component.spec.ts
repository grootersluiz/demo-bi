import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListamarcaComponent } from './listafornecedor.component';

describe('ListamarcaComponent', () => {
  let component: ListamarcaComponent;
  let fixture: ComponentFixture<ListamarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListamarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListamarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
