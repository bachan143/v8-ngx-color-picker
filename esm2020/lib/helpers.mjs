import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
export function calculateAutoPositioning(elBounds, triggerElBounds) {
    // Defaults
    let usePositionX = 'right';
    let usePositionY = 'bottom';
    // Calculate collisions
    const { height, width } = elBounds;
    const { top, left } = triggerElBounds;
    const bottom = top + triggerElBounds.height;
    const right = left + triggerElBounds.width;
    const collisionTop = top - height < 0;
    const collisionBottom = bottom + height > (window.innerHeight || document.documentElement.clientHeight);
    const collisionLeft = left - width < 0;
    const collisionRight = right + width > (window.innerWidth || document.documentElement.clientWidth);
    const collisionAll = collisionTop && collisionBottom && collisionLeft && collisionRight;
    // Generate X & Y position values
    if (collisionBottom) {
        usePositionY = 'top';
    }
    if (collisionTop) {
        usePositionY = 'bottom';
    }
    if (collisionLeft) {
        usePositionX = 'right';
    }
    if (collisionRight) {
        usePositionX = 'left';
    }
    // Choose the largest gap available
    if (collisionAll) {
        const postions = ['left', 'right', 'top', 'bottom'];
        return postions.reduce((prev, next) => elBounds[prev] > elBounds[next] ? prev : next);
    }
    if ((collisionLeft && collisionRight)) {
        if (collisionTop) {
            return 'bottom';
        }
        if (collisionBottom) {
            return 'top';
        }
        return top > bottom ? 'top' : 'bottom';
    }
    if ((collisionTop && collisionBottom)) {
        if (collisionLeft) {
            return 'right';
        }
        if (collisionRight) {
            return 'left';
        }
        return left > right ? 'left' : 'right';
    }
    return `${usePositionY}-${usePositionX}`;
}
export function detectIE() {
    let ua = '';
    if (typeof navigator !== 'undefined') {
        ua = navigator.userAgent.toLowerCase();
    }
    const msie = ua.indexOf('msie ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    // Other browser
    return false;
}
export class TextDirective {
    constructor() {
        this.newValue = new EventEmitter();
    }
    inputChange(event) {
        const value = event.target.value;
        if (this.rg === undefined) {
            this.newValue.emit(value);
        }
        else {
            const numeric = parseFloat(value);
            this.newValue.emit({ v: numeric, rg: this.rg });
        }
    }
}
TextDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: TextDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
TextDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.1", type: TextDirective, selector: "[text]", inputs: { rg: "rg", text: "text" }, outputs: { newValue: "newValue" }, host: { listeners: { "input": "inputChange($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: TextDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[text]'
                }]
        }], propDecorators: { rg: [{
                type: Input
            }], text: [{
                type: Input
            }], newValue: [{
                type: Output
            }], inputChange: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
export class SliderDirective {
    constructor(elRef) {
        this.elRef = elRef;
        this.dragEnd = new EventEmitter();
        this.dragStart = new EventEmitter();
        this.newValue = new EventEmitter();
        this.listenerMove = (event) => this.move(event);
        this.listenerStop = () => this.stop();
    }
    mouseDown(event) {
        this.start(event);
    }
    touchStart(event) {
        this.start(event);
    }
    move(event) {
        event.preventDefault();
        this.setCursor(event);
    }
    start(event) {
        this.setCursor(event);
        event.stopPropagation();
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        this.dragStart.emit();
    }
    stop() {
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        this.dragEnd.emit();
    }
    getX(event) {
        const position = this.elRef.nativeElement.getBoundingClientRect();
        const pageX = (event.pageX !== undefined) ? event.pageX : event.touches[0].pageX;
        return pageX - position.left - window.pageXOffset;
    }
    getY(event) {
        const position = this.elRef.nativeElement.getBoundingClientRect();
        const pageY = (event.pageY !== undefined) ? event.pageY : event.touches[0].pageY;
        return pageY - position.top - window.pageYOffset;
    }
    setCursor(event) {
        const width = this.elRef.nativeElement.offsetWidth;
        const height = this.elRef.nativeElement.offsetHeight;
        const x = Math.max(0, Math.min(this.getX(event), width));
        const y = Math.max(0, Math.min(this.getY(event), height));
        if (this.rgX !== undefined && this.rgY !== undefined) {
            this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
        }
        else if (this.rgX === undefined && this.rgY !== undefined) {
            this.newValue.emit({ v: y / height, rgY: this.rgY });
        }
        else if (this.rgX !== undefined && this.rgY === undefined) {
            this.newValue.emit({ v: x / width, rgX: this.rgX });
        }
    }
}
SliderDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: SliderDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
SliderDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.1", type: SliderDirective, selector: "[slider]", inputs: { rgX: "rgX", rgY: "rgY", slider: "slider" }, outputs: { dragEnd: "dragEnd", dragStart: "dragStart", newValue: "newValue" }, host: { listeners: { "mousedown": "mouseDown($event)", "touchstart": "touchStart($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: SliderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[slider]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { rgX: [{
                type: Input
            }], rgY: [{
                type: Input
            }], slider: [{
                type: Input
            }], dragEnd: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], newValue: [{
                type: Output
            }], mouseDown: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }], touchStart: [{
                type: HostListener,
                args: ['touchstart', ['$event']]
            }] } });
export class SliderPosition {
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
export class SliderDimension {
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQWMsTUFBTSxlQUFlLENBQUM7O0FBa0JqRyxNQUFNLFVBQVUsd0JBQXdCLENBQUMsUUFBMkIsRUFBRSxlQUFrQztJQUN0RyxXQUFXO0lBQ1gsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBQzNCLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUM1Qix1QkFBdUI7SUFDdkIsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFDbkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcsR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7SUFFM0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdEMsTUFBTSxlQUFlLEdBQUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4RyxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLGNBQWMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25HLE1BQU0sWUFBWSxHQUFHLFlBQVksSUFBSSxlQUFlLElBQUksYUFBYSxJQUFJ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UyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUFHLENBQUM7Q0FDdkY7QUFFRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFtQixDQUFTLEVBQVMsQ0FBUyxFQUFTLENBQVMsRUFBUyxDQUFTO1FBQS9ELE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFBRyxDQUFDO0NBQ3ZGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuZXhwb3J0IHR5cGUgQ29sb3JNb2RlID0gJ2NvbG9yJyB8ICdjJyB8ICcxJyB8XHJcbiAgJ2dyYXlzY2FsZScgfCAnZycgfCAnMicgfCAncHJlc2V0cycgfCAncCcgfCAnMyc7XHJcblxyXG5leHBvcnQgdHlwZSBBbHBoYUNoYW5uZWwgPSAnZW5hYmxlZCcgfCAnZGlzYWJsZWQnIHwgJ2Fsd2F5cycgfCAnZm9yY2VkJztcclxuXHJcbmV4cG9ydCB0eXBlIEJvdW5kaW5nUmVjdGFuZ2xlID0ge1xyXG4gIHRvcDogbnVtYmVyO1xyXG4gIGJvdHRvbTogbnVtYmVyO1xyXG4gIGxlZnQ6IG51bWJlcjtcclxuICByaWdodDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBPdXRwdXRGb3JtYXQgPSAnYXV0bycgfCAnaGV4JyB8ICdyZ2JhJyB8ICdoc2xhJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVBdXRvUG9zaXRpb25pbmcoZWxCb3VuZHM6IEJvdW5kaW5nUmVjdGFuZ2xlLCB0cmlnZ2VyRWxCb3VuZHM6IEJvdW5kaW5nUmVjdGFuZ2xlKTogc3RyaW5nIHtcclxuICAvLyBEZWZhdWx0c1xyXG4gIGxldCB1c2VQb3NpdGlvblggPSAncmlnaHQnO1xyXG4gIGxldCB1c2VQb3NpdGlvblkgPSAnYm90dG9tJztcclxuICAvLyBDYWxjdWxhdGUgY29sbGlzaW9uc1xyXG4gIGNvbnN0IHsgaGVpZ2h0LCB3aWR0aCB9ID0gZWxCb3VuZHM7XHJcbiAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IHRyaWdnZXJFbEJvdW5kcztcclxuICBjb25zdCBib3R0b20gPSB0b3AgKyB0cmlnZ2VyRWxCb3VuZHMuaGVpZ2h0O1xyXG4gIGNvbnN0IHJpZ2h0ID0gbGVmdCArIHRyaWdnZXJFbEJvdW5kcy53aWR0aDtcclxuXHJcbiAgY29uc3QgY29sbGlzaW9uVG9wID0gdG9wIC0gaGVpZ2h0IDwgMDtcclxuICBjb25zdCBjb2xsaXNpb25Cb3R0b20gPSBib3R0b20gKyBoZWlnaHQgPiAod2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpO1xyXG4gIGNvbnN0IGNvbGxpc2lvbkxlZnQgPSBsZWZ0IC0gd2lkdGggPCAwO1xyXG4gIGNvbnN0IGNvbGxpc2lvblJpZ2h0ID0gcmlnaHQgKyB3aWR0aCA+ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xyXG4gIGNvbnN0IGNvbGxpc2lvbkFsbCA9IGNvbGxpc2lvblRvcCAmJiBjb2xsaXNpb25Cb3R0b20gJiYgY29sbGlzaW9uTGVmdCAmJiBjb2xsaXNpb25SaWdodDtcclxuXHJcbiAgLy8gR2VuZXJhdGUgWCAmIFkgcG9zaXRpb24gdmFsdWVzXHJcbiAgaWYgKGNvbGxpc2lvbkJvdHRvbSkge1xyXG4gICAgdXNlUG9zaXRpb25ZID0gJ3RvcCc7XHJcbiAgfVxyXG5cclxuICBpZiAoY29sbGlzaW9uVG9wKSB7XHJcbiAgICB1c2VQb3NpdGlvblkgPSAnYm90dG9tJztcclxuICB9XHJcblxyXG4gIGlmIChjb2xsaXNpb25MZWZ0KSB7XHJcbiAgICB1c2VQb3NpdGlvblggPSAncmlnaHQnO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNvbGxpc2lvblJpZ2h0KSB7XHJcbiAgICB1c2VQb3NpdGlvblggPSAnbGVmdCc7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ2hvb3NlIHRoZSBsYXJnZXN0IGdhcCBhdmFpbGFibGVcclxuICBpZiAoY29sbGlzaW9uQWxsKSB7XHJcbiAgICBjb25zdCBwb3N0aW9ucyA9IFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XHJcbiAgICByZXR1cm4gcG9zdGlvbnMucmVkdWNlKChwcmV2LCBuZXh0KSA9PiBlbEJvdW5kc1twcmV2XSA+IGVsQm91bmRzW25leHRdID8gcHJldiA6IG5leHQpO1xyXG4gIH1cclxuXHJcbiAgaWYgKChjb2xsaXNpb25MZWZ0ICYmIGNvbGxpc2lvblJpZ2h0KSkge1xyXG4gICAgaWYgKGNvbGxpc2lvblRvcCkgeyByZXR1cm4gJ2JvdHRvbSc7IH1cclxuICAgIGlmIChjb2xsaXNpb25Cb3R0b20pIHsgcmV0dXJuICd0b3AnOyB9XHJcbiAgICByZXR1cm4gdG9wID4gYm90dG9tID8gJ3RvcCcgOiAnYm90dG9tJztcclxuICB9XHJcblxyXG4gIGlmICgoY29sbGlzaW9uVG9wICYmIGNvbGxpc2lvbkJvdHRvbSkpIHtcclxuICAgIGlmIChjb2xsaXNpb25MZWZ0KSB7IHJldHVybiAncmlnaHQnOyB9XHJcbiAgICBpZiAoY29sbGlzaW9uUmlnaHQpIHsgcmV0dXJuICdsZWZ0JzsgfVxyXG4gICAgcmV0dXJuIGxlZnQgPiByaWdodCA/ICdsZWZ0JyA6ICdyaWdodCc7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYCR7dXNlUG9zaXRpb25ZfS0ke3VzZVBvc2l0aW9uWH1gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0SUUoKTogYm9vbGVhbiB8IG51bWJlciB7XHJcbiAgbGV0IHVhID0gJyc7XHJcblxyXG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBtc2llID0gdWEuaW5kZXhPZignbXNpZSAnKTtcclxuXHJcbiAgaWYgKG1zaWUgPiAwKSB7XHJcbiAgICAvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTtcclxuICB9XHJcblxyXG4gIC8vIE90aGVyIGJyb3dzZXJcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW3RleHRdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGV4dERpcmVjdGl2ZSB7XHJcbiAgQElucHV0KCkgcmc6IG51bWJlcjtcclxuICBASW5wdXQoKSB0ZXh0OiBhbnk7XHJcblxyXG4gIEBPdXRwdXQoKSBuZXdWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pIGlucHV0Q2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIGlmICh0aGlzLnJnID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5uZXdWYWx1ZS5lbWl0KHZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IG51bWVyaWMgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuXHJcbiAgICAgIHRoaXMubmV3VmFsdWUuZW1pdCh7IHY6IG51bWVyaWMsIHJnOiB0aGlzLnJnIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbc2xpZGVyXSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNsaWRlckRpcmVjdGl2ZSB7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lck1vdmU6IGFueTtcclxuICBwcml2YXRlIGxpc3RlbmVyU3RvcDogYW55O1xyXG5cclxuICBASW5wdXQoKSByZ1g6IG51bWJlcjtcclxuICBASW5wdXQoKSByZ1k6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KCkgc2xpZGVyOiBzdHJpbmc7XHJcblxyXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKSBuZXdWYWx1ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKSBtb3VzZURvd24oZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGFydChldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgWyckZXZlbnQnXSkgdG91Y2hTdGFydChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXJ0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYpIHtcclxuICAgIHRoaXMubGlzdGVuZXJNb3ZlID0gKGV2ZW50OiBhbnkpID0+IHRoaXMubW92ZShldmVudCk7XHJcblxyXG4gICAgdGhpcy5saXN0ZW5lclN0b3AgPSAoKSA9PiB0aGlzLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbW92ZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuc2V0Q3Vyc29yKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhcnQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5zZXRDdXJzb3IoZXZlbnQpO1xyXG5cclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmxpc3RlbmVyU3RvcCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMubGlzdGVuZXJTdG9wKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubGlzdGVuZXJNb3ZlKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMubGlzdGVuZXJNb3ZlKTtcclxuXHJcbiAgICB0aGlzLmRyYWdTdGFydC5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN0b3AoKTogdm9pZCB7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5saXN0ZW5lclN0b3ApO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmxpc3RlbmVyU3RvcCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmxpc3RlbmVyTW92ZSk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLmxpc3RlbmVyTW92ZSk7XHJcblxyXG4gICAgdGhpcy5kcmFnRW5kLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0WChldmVudDogYW55KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIGNvbnN0IHBhZ2VYID0gKGV2ZW50LnBhZ2VYICE9PSB1bmRlZmluZWQpID8gZXZlbnQucGFnZVggOiBldmVudC50b3VjaGVzWzBdLnBhZ2VYO1xyXG5cclxuICAgIHJldHVybiBwYWdlWCAtIHBvc2l0aW9uLmxlZnQgLSB3aW5kb3cucGFnZVhPZmZzZXQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFkoZXZlbnQ6IGFueSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCBwYWdlWSA9IChldmVudC5wYWdlWSAhPT0gdW5kZWZpbmVkKSA/IGV2ZW50LnBhZ2VZIDogZXZlbnQudG91Y2hlc1swXS5wYWdlWTtcclxuXHJcbiAgICByZXR1cm4gcGFnZVkgLSBwb3NpdGlvbi50b3AgLSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEN1cnNvcihldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgY29uc3QgeCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRoaXMuZ2V0WChldmVudCksIHdpZHRoKSk7XHJcbiAgICBjb25zdCB5ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5nZXRZKGV2ZW50KSwgaGVpZ2h0KSk7XHJcblxyXG4gICAgaWYgKHRoaXMucmdYICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZ1kgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLm5ld1ZhbHVlLmVtaXQoeyBzOiB4IC8gd2lkdGgsIHY6ICgxIC0geSAvIGhlaWdodCksIHJnWDogdGhpcy5yZ1gsIHJnWTogdGhpcy5yZ1kgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmdYID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZ1kgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLm5ld1ZhbHVlLmVtaXQoeyB2OiB5IC8gaGVpZ2h0LCByZ1k6IHRoaXMucmdZIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnJnWCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmdZID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5uZXdWYWx1ZS5lbWl0KHsgdjogeCAvIHdpZHRoLCByZ1g6IHRoaXMucmdYIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNsaWRlclBvc2l0aW9uIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaDogbnVtYmVyLCBwdWJsaWMgczogbnVtYmVyLCBwdWJsaWMgdjogbnVtYmVyLCBwdWJsaWMgYTogbnVtYmVyKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2xpZGVyRGltZW5zaW9uIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaDogbnVtYmVyLCBwdWJsaWMgczogbnVtYmVyLCBwdWJsaWMgdjogbnVtYmVyLCBwdWJsaWMgYTogbnVtYmVyKSB7fVxyXG59XHJcbiJdfQ==