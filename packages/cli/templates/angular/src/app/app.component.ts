import { ChangeDetectionStrategy, Component, Injectable, Input } from "@angular/core";
import { contextProvider } from "./context";
import { Context } from "@euglena/organelle.ui.angular";
import { Particle } from "@euglena/core";
import { State } from "src/euglena/state";
import { Subscription, timer } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";

type Render = Particle<"Render", State>;

@Injectable()
export class MyService {
    getCounter(tick) {
        return timer(0, tick);
    }
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    providers: [contextProvider, MyService]
})
export class AppComponent {
    title = "must_be_replaced";
    time: string;

    constructor(private context: Context<State>, private ref: ChangeDetectorRef) {}

    timeSubscriber: Subscription;

    ngOnInit() {
        this.timeSubscriber = this.context.stateEmitter.subscribe((state) => {
            this.title = state.title;
            const hour = `${state.time.clock.hour}`.padStart(2, "0");
            const minute = `${state.time.clock.minute}`.padStart(2, "0");
            const second = `${state.time.clock.second}`.padStart(2, "0");
            this.time = `${hour}:${minute}:${second}`;
            this.ref.detectChanges();
        });
    }

    ngOnDestroy() {
        this.timeSubscriber.unsubscribe();
    }
}
