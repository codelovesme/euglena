import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import {
  Character,
  createE,
  createU,
  createG,
  createL,
  createN,
  createA,
} from './characters';

@Component({
  selector: 'Banner',
  templateUrl: './banner.html',
  styleUrls: ['./banner.css'],
  providers: [],
})
export class Banner {
  @ViewChild('canvas', { static: false })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  width: number;
  height: string;
  defaultCharacters: Character[] = [];
  characters: Character[] = [];

  private readonly _radius = 6;
  @Input()
  get radius() {
    return this._radius * this.scale;
  }

  private interval: any;

  private readonly defaultCanvasWidth = 1530;
  private readonly defaultCanvasHeight = 220;

  private readonly _borderWidth = 10;
  private get borderWidth() {
    return this._borderWidth * this.scale;
  }
  /**
   * Change this variable to change text size
   */
  private readonly preferredCanvasWidth = 800;
  private get margin() {
    const margin = (window.innerWidth - this.preferredCanvasWidth) / 2;
    return margin > 0 ? margin : 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    clearInterval(this.interval);
    this.resize();
    this.draw(...this.characters);
  }

  ngOnInit() {
    this.defaultCharacters.push(createE(0));
    this.defaultCharacters.push(createU(200));
    this.defaultCharacters.push(createG(440));
    this.defaultCharacters.push(createL(680));
    this.defaultCharacters.push(createE(890));
    this.defaultCharacters.push(createN(1090));
    this.defaultCharacters.push(createA(1330));
  }
  private get canvasSize() {
    return {
      width: this.defaultCanvasWidth * this.scale,
      height: this.defaultCanvasHeight * this.scale,
    };
  }
  private get printableSize() {
    return {
      width: this.canvasSize.width - 2 * this.borderWidth,
      height: this.canvasSize.height - 2 * this.borderWidth,
    };
  }
  scale: number;
  resize() {
    const innerWidth = window.innerWidth - 10 - 2 * this.margin; /*buffer*/
    this.scale =
      innerWidth < this.defaultCanvasWidth
        ? innerWidth / this.defaultCanvasWidth
        : 1;
    this.canvas.nativeElement.width = this.canvasSize.width;
    this.canvas.nativeElement.height = this.canvasSize.height;
    /**
     * Resize characters
     */
    this.characters = this.defaultCharacters.map((c) => ({
      offset: c.offset * this.scale,
      parts: c.parts.map((p) => ({
        x: p.x * this.scale,
        y: p.y * this.scale,
        w: p.w * this.scale,
        h: p.h * this.scale,
      })),
    }));
  }
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.resize();
    this.draw(...this.characters);
  }

  draw(...characters: Character[]) {
    const contains = (X: number, Y: number) => {
      for (let { parts, offset } of characters) {
        for (let { x, y, w, h } of parts) {
          if (x + offset < X && y < Y && X < x + w + offset && Y < y + h) {
            return true;
          }
        }
      }
      return false;
    };
    this.ctx.fillStyle = 'red';
    this.interval = setInterval(() => {
      const x =
        this.borderWidth + Math.floor(Math.random() * this.printableSize.width);
      const y =
        this.borderWidth +
        Math.floor(Math.random() * this.printableSize.height);
      if (contains(x, y)) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        this.ctx.fillStyle = `rgb(${r},${g},${b})`;
        this.drawCircle(x, y);
      }
    }, 10);
  }
  drawChar({ parts, offset }: Character) {
    for (let { x, y, w, h } of parts) {
      this.ctx.fillRect(x + offset, y, w, h);
    }
  }
  drawCircle(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'lightgray';
    this.ctx.stroke();
  }
}
