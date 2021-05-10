import { Context } from '@euglena/organelle.ui.angular';

export const context = new Context();

export const contextProvider = { provide: Context, useValue: context };
