import { Context } from '@euglena/organelle.ui.angular';
import { State } from '../state';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
export declare class MyService {
    getCounter(tick: any): import("rxjs").Observable<0>;
}
export declare class AppComponent {
    private context;
    private ref;
    title: string;
    time: string;
    constructor(context: Context<State>, ref: ChangeDetectorRef);
    timeSubscriber: Subscription;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
//# sourceMappingURL=app.component.d.ts.map