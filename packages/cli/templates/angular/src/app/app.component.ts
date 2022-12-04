import { Component, Injectable } from '@angular/core';
import { contextProvider } from './context';
import { Context } from '@euglena/organelle.ui.angular';
import { State } from '../state';
import { Subscription, timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Injectable()
export class MyService {
  getCounter(tick) {
    return timer(0, tick);
  }
}

const padIfUndefined = <T extends unknown>(
  value: T,
  callback: (value: Exclude<T, undefined>) => string,
  pad: string = '-'
) => (value === undefined ? pad : callback(value as Exclude<T, undefined>));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [contextProvider, MyService],
})
export class AppComponent {
  title = 'must_be_replaced';
  time: string;

  constructor(
    private context: Context<State>,
    private ref: ChangeDetectorRef
  ) {}

  timeSubscriber: Subscription;

  ngOnInit() {
    const subscribe = () => {
      this.timeSubscriber = this.context.stateEmitter.subscribe((state) => {
        this.time = padIfUndefined(
          state.data,
          (value) => {
            const hour = `${value.time.clock.hour}`.padStart(2, '0');
            const minute = `${value.time.clock.minute}`.padStart(2, '0');
            const second = `${value.time.clock.second}`.padStart(2, '0');
            return `${hour}:${minute}:${second}`;
          },
          '00:00:00'
        );
        this.ref.detectChanges();
      });
      console.log('stateEmitter subscription has been done !');
    };
    if (!this.context.stateEmitter) {
      const interval = setInterval(() => {
        if (this.context.stateEmitter) {
          subscribe();
          clearInterval(interval);
          console.log('stateEmitter subscription interval has been removed !');
        }
      }, 100);
      console.log('stateEmitter subscription interval has been created !');
    } else {
      subscribe();
    }
  }

  ngOnDestroy() {
    this.timeSubscriber.unsubscribe();
  }
}
