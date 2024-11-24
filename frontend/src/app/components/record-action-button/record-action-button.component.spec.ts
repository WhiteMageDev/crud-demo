import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordActionButtonComponent } from './record-action-button.component';

describe('UpdateRecordBtnComponent', () => {
  let component: RecordActionButtonComponent;
  let fixture: ComponentFixture<RecordActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordActionButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
