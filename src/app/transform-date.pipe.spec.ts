import { TestBed } from '@angular/core/testing';
import { TransformDatePipe } from './transform-date.pipe';
import { Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

describe('TransformDatePipe', () => {
  let pipe: TransformDatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
      providers: [TransformDatePipe, { provide: Firestore, useValue: {} }]
    });

    // Get an instance of the pipe through dependency injection
    pipe = TestBed.inject(TransformDatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
