import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelxTokenDialogComponent } from './intelx-token-dialog.component';

describe('IntelxTokenDialogComponent', () => {
  let component: IntelxTokenDialogComponent;
  let fixture: ComponentFixture<IntelxTokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelxTokenDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelxTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
