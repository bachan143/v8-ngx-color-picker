import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextDirective, SliderDirective } from './helpers';
import { ColorPickerService } from './color-picker.service';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerDirective } from './color-picker.directive';
import './ng-dev-mode';
import * as i0 from "@angular/core";
export class ColorPickerModule {
}
ColorPickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ColorPickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerModule, declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective], imports: [CommonModule], exports: [ColorPickerDirective] });
ColorPickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerModule, providers: [ColorPickerService], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [ColorPickerDirective],
                    providers: [ColorPickerService],
                    declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective],
                    entryComponents: [ColorPickerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEUsT0FBTyxlQUFlLENBQUM7O0FBU3ZCLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFIWixvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsZUFBZSxhQUgvRSxZQUFZLGFBQ1osb0JBQW9COytHQUtwQixpQkFBaUIsYUFKakIsQ0FBRSxrQkFBa0IsQ0FBRSxZQUZ4QixDQUFFLFlBQVksQ0FBRTsyRkFNZCxpQkFBaUI7a0JBUDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUUsWUFBWSxDQUFFO29CQUN6QixPQUFPLEVBQUUsQ0FBRSxvQkFBb0IsQ0FBRTtvQkFDakMsU0FBUyxFQUFFLENBQUUsa0JBQWtCLENBQUU7b0JBQ2pDLFlBQVksRUFBRSxDQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUU7b0JBQzVGLGVBQWUsRUFBRSxDQUFFLG9CQUFvQixDQUFFO2lCQUMxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBUZXh0RGlyZWN0aXZlLCBTbGlkZXJEaXJlY3RpdmUgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5cclxuaW1wb3J0IHsgQ29sb3JQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9jb2xvci1waWNrZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbG9yUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb2xvci1waWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29sb3JQaWNrZXJEaXJlY3RpdmUgfSBmcm9tICcuL2NvbG9yLXBpY2tlci5kaXJlY3RpdmUnO1xyXG5cclxuaW1wb3J0ICcuL25nLWRldi1tb2RlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogWyBDb21tb25Nb2R1bGUgXSxcclxuICBleHBvcnRzOiBbIENvbG9yUGlja2VyRGlyZWN0aXZlIF0sXHJcbiAgcHJvdmlkZXJzOiBbIENvbG9yUGlja2VyU2VydmljZSBdLFxyXG4gIGRlY2xhcmF0aW9uczogWyBDb2xvclBpY2tlckNvbXBvbmVudCwgQ29sb3JQaWNrZXJEaXJlY3RpdmUsIFRleHREaXJlY3RpdmUsIFNsaWRlckRpcmVjdGl2ZSBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogWyBDb2xvclBpY2tlckNvbXBvbmVudCBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlck1vZHVsZSB7fVxyXG4iXX0=