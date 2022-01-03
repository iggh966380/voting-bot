import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingBotComponent } from './voting-bot.component';

describe('VotingBotComponent', () => {
  let component: VotingBotComponent;
  let fixture: ComponentFixture<VotingBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
