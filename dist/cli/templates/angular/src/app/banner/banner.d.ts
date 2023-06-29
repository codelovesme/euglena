import { ElementRef } from '@angular/core';
import { Character } from './characters';
export declare class Banner {
    canvas: ElementRef<HTMLCanvasElement>;
    private ctx;
    width: number;
    height: string;
    defaultCharacters: Character[];
    characters: Character[];
    private readonly _radius;
    get radius(): number;
    private interval;
    private readonly defaultCanvasWidth;
    private readonly defaultCanvasHeight;
    private readonly _borderWidth;
    private get borderWidth();
    /**
     * Change this variable to change text size
     */
    private readonly preferredCanvasWidth;
    private get margin();
    onResize(): void;
    ngOnInit(): void;
    private get canvasSize();
    private get printableSize();
    scale: number;
    resize(): void;
    ngAfterViewInit(): void;
    draw(...characters: Character[]): void;
    drawChar({ parts, offset }: Character): void;
    drawCircle(x: number, y: number): void;
}
//# sourceMappingURL=banner.d.ts.map