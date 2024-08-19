import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBtnComponent } from './my-btn.component';

describe('MyBtnComponent', () => {
  let component: MyBtnComponent;
  let fixture: ComponentFixture<MyBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
