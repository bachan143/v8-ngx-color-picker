import { Directive, Input, Output, EventEmitter, HostListener, Injector } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "./color-picker.service";
// Caretaker note: we have still left the `typeof` condition in order to avoid
// creating a breaking change for projects that still use the View Engine.
// The `ngDevMode` is always available when Ivy is enabled.
// This will be evaluated during compilation into `const NG_DEV_MODE = false`,
// thus Terser will be able to tree-shake `console.warn` calls.
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
export class ColorPickerDirective {
    constructor(injector, cfr, appRef, vcRef, elRef, _service) {
        this.injector = injector;
        this.cfr = cfr;
        this.appRef = appRef;
        this.vcRef = vcRef;
        this.elRef = elRef;
        this._service = _service;
        this.dialogCreated = false;
        this.ignoreChanges = false;
        this.viewAttachedToAppRef = false;
        this.cpWidth = '230px';
        this.cpHeight = 'auto';
        this.cpToggle = false;
        this.cpDisabled = false;
        this.cpIgnoredElements = [];
        this.cpFallbackColor = '';
        this.cpColorMode = 'color';
        this.cpCmykEnabled = false;
        this.cpOutputFormat = 'auto';
        this.cpAlphaChannel = 'enabled';
        this.cpDisableInput = false;
        this.cpDialogDisplay = 'popup';
        this.cpSaveClickOutside = true;
        this.cpCloseClickOutside = true;
        this.cpUseRootViewContainer = false;
        this.cpPosition = 'auto';
        this.cpPositionOffset = '0%';
        this.cpPositionRelativeToArrow = false;
        this.cpOKButton = false;
        this.cpOKButtonText = 'OK';
        this.cpOKButtonClass = 'cp-ok-button-class';
        this.cpCancelButton = false;
        this.cpCancelButtonText = 'Cancel';
        this.cpCancelButtonClass = 'cp-cancel-button-class';
        this.cpEyeDropper = false;
        this.cpPresetLabel = 'Preset colors';
        this.cpPresetColorsClass = 'cp-preset-colors-class';
        this.cpMaxPresetColorsLength = 6;
        this.cpPresetEmptyMessage = 'No colors added';
        this.cpPresetEmptyMessageClass = 'preset-empty-message';
        this.cpAddColorButton = false;
        this.cpAddColorButtonText = 'Add color';
        this.cpAddColorButtonClass = 'cp-add-color-button-class';
        this.cpRemoveColorButtonClass = 'cp-remove-color-button-class';
        this.headerName = 'Edit Color';
        this.saveBtnTxt = "'Save'";
        this.cancelBtnTxt = "'Cancel'";
        this.cpInputChange = new EventEmitter(true);
        this.cpToggleChange = new EventEmitter(true);
        this.cpSliderChange = new EventEmitter(true);
        this.cpSliderDragEnd = new EventEmitter(true);
        this.cpSliderDragStart = new EventEmitter(true);
        this.colorPickerOpen = new EventEmitter(true);
        this.colorPickerClose = new EventEmitter(true);
        this.colorPickerCancel = new EventEmitter(true);
        this.colorPickerSelect = new EventEmitter(true);
        this.colorPickerChange = new EventEmitter(false);
        this.cpCmykColorChange = new EventEmitter(true);
        this.cpPresetColorsChange = new EventEmitter(true);
    }
    handleClick() {
        this.inputFocus();
    }
    handleFocus() {
        this.inputFocus();
    }
    handleInput(event) {
        this.inputChange(event);
    }
    ngOnDestroy() {
        if (this.cmpRef != null) {
            if (this.viewAttachedToAppRef) {
                this.appRef.detachView(this.cmpRef.hostView);
            }
            this.cmpRef.destroy();
            this.cmpRef = null;
            this.dialog = null;
        }
    }
    ngOnChanges(changes) {
        if (changes.cpToggle && !this.cpDisabled) {
            if (changes.cpToggle.currentValue) {
                this.openDialog();
            }
            else if (!changes.cpToggle.currentValue) {
                this.closeDialog();
            }
        }
        if (changes.colorPicker) {
            if (this.dialog && !this.ignoreChanges) {
                if (this.cpDialogDisplay === 'inline') {
                    this.dialog.setInitialColor(changes.colorPicker.currentValue);
                }
                this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
                if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                    this.cmpRef.changeDetectorRef.detectChanges();
                }
            }
            this.ignoreChanges = false;
        }
        if (changes.cpPresetLabel || changes.cpPresetColors) {
            if (this.dialog) {
                this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
            }
        }
    }
    openDialog() {
        if (!this.dialogCreated) {
            let vcRef = this.vcRef;
            this.dialogCreated = true;
            this.viewAttachedToAppRef = false;
            if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                const classOfRootComponent = this.appRef.componentTypes[0];
                const appInstance = this.injector.get(classOfRootComponent, Injector.NULL);
                if (appInstance !== Injector.NULL) {
                    vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef;
                    if (NG_DEV_MODE && vcRef === this.vcRef) {
                        console.warn('You are using cpUseRootViewContainer, ' +
                            'but the root component is not exposing viewContainerRef!' +
                            'Please expose it by adding \'public vcRef: ViewContainerRef\' to the constructor.');
                    }
                }
                else {
                    this.viewAttachedToAppRef = true;
                }
            }
            const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            if (this.viewAttachedToAppRef) {
                this.cmpRef = compFactory.create(this.injector);
                this.appRef.attachView(this.cmpRef.hostView);
                document.body.appendChild(this.cmpRef.hostView.rootNodes[0]);
            }
            else {
                const injector = Injector.create({
                    providers: [],
                    // We shouldn't use `vcRef.parentInjector` since it's been deprecated long time ago and might be removed
                    // in newer Angular versions: https://github.com/angular/angular/pull/25174.
                    parent: vcRef.injector,
                });
                this.cmpRef = vcRef.createComponent(compFactory, 0, injector, []);
            }
            this.cmpRef.instance.setupDialog(this, this.elRef, this.colorPicker, this.cpWidth, this.cpHeight, this.cpDialogDisplay, this.cpFallbackColor, this.cpColorMode, this.cpCmykEnabled, this.cpAlphaChannel, this.cpOutputFormat, this.cpDisableInput, this.cpIgnoredElements, this.cpSaveClickOutside, this.cpCloseClickOutside, this.cpUseRootViewContainer, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpPresetLabel, this.cpPresetColors, this.cpPresetColorsClass, this.cpMaxPresetColorsLength, this.cpPresetEmptyMessage, this.cpPresetEmptyMessageClass, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpAddColorButton, this.cpAddColorButtonClass, this.cpAddColorButtonText, this.cpRemoveColorButtonClass, this.cpEyeDropper, this.elRef, this.cpExtraTemplate, this.headerName, this.saveBtnTxt, this.cancelBtnTxt);
            this.dialog = this.cmpRef.instance;
            if (this.vcRef !== vcRef) {
                this.cmpRef.changeDetectorRef.detectChanges();
            }
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.colorPicker);
        }
    }
    closeDialog() {
        if (this.dialog && this.cpDialogDisplay === 'popup') {
            this.dialog.closeDialog();
        }
    }
    cmykChanged(value) {
        this.cpCmykColorChange.emit(value);
    }
    stateChanged(state) {
        this.cpToggleChange.emit(state);
        if (state) {
            this.colorPickerOpen.emit(this.colorPicker);
        }
        else {
            this.colorPickerClose.emit(this.colorPicker);
        }
    }
    colorChanged(value, ignore = true) {
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    }
    colorSelected(value) {
        this.colorPickerSelect.emit(value);
    }
    colorCanceled() {
        this.colorPickerCancel.emit();
    }
    inputFocus() {
        const element = this.elRef.nativeElement;
        const ignored = this.cpIgnoredElements.filter((item) => item === element);
        if (!this.cpDisabled && !ignored.length) {
            if (typeof document !== 'undefined' && element === document.activeElement) {
                this.openDialog();
            }
            else if (!this.dialog || !this.dialog.show) {
                this.openDialog();
            }
            else {
                this.closeDialog();
            }
        }
    }
    inputChange(event) {
        if (this.dialog) {
            this.dialog.setColorFromString(event.target.value, true);
        }
        else {
            this.colorPicker = event.target.value;
            this.colorPickerChange.emit(this.colorPicker);
        }
    }
    inputChanged(event) {
        this.cpInputChange.emit(event);
    }
    sliderChanged(event) {
        this.cpSliderChange.emit(event);
    }
    sliderDragEnd(event) {
        this.cpSliderDragEnd.emit(event);
    }
    sliderDragStart(event) {
        this.cpSliderDragStart.emit(event);
    }
    presetColorsChanged(value) {
        this.cpPresetColorsChange.emit(value);
    }
}
ColorPickerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerDirective, deps: [{ token: i0.Injector }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.ColorPickerService }], target: i0.ɵɵFactoryTarget.Directive });
ColorPickerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.1", type: ColorPickerDirective, selector: "[colorPicker]", inputs: { colorPicker: "colorPicker", cpWidth: "cpWidth", cpHeight: "cpHeight", cpToggle: "cpToggle", cpDisabled: "cpDisabled", cpIgnoredElements: "cpIgnoredElements", cpFallbackColor: "cpFallbackColor", cpColorMode: "cpColorMode", cpCmykEnabled: "cpCmykEnabled", cpOutputFormat: "cpOutputFormat", cpAlphaChannel: "cpAlphaChannel", cpDisableInput: "cpDisableInput", cpDialogDisplay: "cpDialogDisplay", cpSaveClickOutside: "cpSaveClickOutside", cpCloseClickOutside: "cpCloseClickOutside", cpUseRootViewContainer: "cpUseRootViewContainer", cpPosition: "cpPosition", cpPositionOffset: "cpPositionOffset", cpPositionRelativeToArrow: "cpPositionRelativeToArrow", cpOKButton: "cpOKButton", cpOKButtonText: "cpOKButtonText", cpOKButtonClass: "cpOKButtonClass", cpCancelButton: "cpCancelButton", cpCancelButtonText: "cpCancelButtonText", cpCancelButtonClass: "cpCancelButtonClass", cpEyeDropper: "cpEyeDropper", cpPresetLabel: "cpPresetLabel", cpPresetColors: "cpPresetColors", cpPresetColorsClass: "cpPresetColorsClass", cpMaxPresetColorsLength: "cpMaxPresetColorsLength", cpPresetEmptyMessage: "cpPresetEmptyMessage", cpPresetEmptyMessageClass: "cpPresetEmptyMessageClass", cpAddColorButton: "cpAddColorButton", cpAddColorButtonText: "cpAddColorButtonText", cpAddColorButtonClass: "cpAddColorButtonClass", cpRemoveColorButtonClass: "cpRemoveColorButtonClass", cpExtraTemplate: "cpExtraTemplate", headerName: "headerName", saveBtnTxt: "saveBtnTxt", cancelBtnTxt: "cancelBtnTxt" }, outputs: { cpInputChange: "cpInputChange", cpToggleChange: "cpToggleChange", cpSliderChange: "cpSliderChange", cpSliderDragEnd: "cpSliderDragEnd", cpSliderDragStart: "cpSliderDragStart", colorPickerOpen: "colorPickerOpen", colorPickerClose: "colorPickerClose", colorPickerCancel: "colorPickerCancel", colorPickerSelect: "colorPickerSelect", colorPickerChange: "colorPickerChange", cpCmykColorChange: "cpCmykColorChange", cpPresetColorsChange: "cpPresetColorsChange" }, host: { listeners: { "click": "handleClick()", "focus": "handleFocus()", "input": "handleInput($event)" } }, exportAs: ["ngxColorPicker"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: ColorPickerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[colorPicker]',
                    exportAs: 'ngxColorPicker'
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.ColorPickerService }]; }, propDecorators: { colorPicker: [{
                type: Input
            }], cpWidth: [{
                type: Input
            }], cpHeight: [{
                type: Input
            }], cpToggle: [{
                type: Input
            }], cpDisabled: [{
                type: Input
            }], cpIgnoredElements: [{
                type: Input
            }], cpFallbackColor: [{
                type: Input
            }], cpColorMode: [{
                type: Input
            }], cpCmykEnabled: [{
                type: Input
            }], cpOutputFormat: [{
                type: Input
            }], cpAlphaChannel: [{
                type: Input
            }], cpDisableInput: [{
                type: Input
            }], cpDialogDisplay: [{
                type: Input
            }], cpSaveClickOutside: [{
                type: Input
            }], cpCloseClickOutside: [{
                type: Input
            }], cpUseRootViewContainer: [{
                type: Input
            }], cpPosition: [{
                type: Input
            }], cpPositionOffset: [{
                type: Input
            }], cpPositionRelativeToArrow: [{
                type: Input
            }], cpOKButton: [{
                type: Input
            }], cpOKButtonText: [{
                type: Input
            }], cpOKButtonClass: [{
                type: Input
            }], cpCancelButton: [{
                type: Input
            }], cpCancelButtonText: [{
                type: Input
            }], cpCancelButtonClass: [{
                type: Input
            }], cpEyeDropper: [{
                type: Input
            }], cpPresetLabel: [{
                type: Input
            }], cpPresetColors: [{
                type: Input
            }], cpPresetColorsClass: [{
                type: Input
            }], cpMaxPresetColorsLength: [{
                type: Input
            }], cpPresetEmptyMessage: [{
                type: Input
            }], cpPresetEmptyMessageClass: [{
                type: Input
            }], cpAddColorButton: [{
                type: Input
            }], cpAddColorButtonText: [{
                type: Input
            }], cpAddColorButtonClass: [{
                type: Input
            }], cpRemoveColorButtonClass: [{
                type: Input
            }], cpExtraTemplate: [{
                type: Input
            }], headerName: [{
                type: Input,
                args: ['headerName']
            }], saveBtnTxt: [{
                type: Input,
                args: ['saveBtnTxt']
            }], cancelBtnTxt: [{
                type: Input,
                args: ['cancelBtnTxt']
            }], cpInputChange: [{
                type: Output
            }], cpToggleChange: [{
                type: Output
            }], cpSliderChange: [{
                type: Output
            }], cpSliderDragEnd: [{
                type: Output
            }], cpSliderDragStart: [{
                type: Output
            }], colorPickerOpen: [{
                type: Output
            }], colorPickerClose: [{
                type: Output
            }], colorPickerCancel: [{
                type: Output
            }], colorPickerSelect: [{
                type: Output
            }], colorPickerChange: [{
                type: Output
            }], cpCmykColorChange: [{
                type: Output
            }], cpPresetColorsChange: [{
                type: Output
            }], handleClick: [{
                type: HostListener,
                args: ['click']
            }], handleFocus: [{
                type: HostListener,
                args: ['focus']
            }], handleInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBd0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQ25FLFlBQVksRUFDWixRQUFRLEVBQTBELE1BQU0sZUFBZSxDQUFDO0FBRzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7QUFJaEUsOEVBQThFO0FBQzlFLDBFQUEwRTtBQUMxRSwyREFBMkQ7QUFDM0QsOEVBQThFO0FBQzlFLCtEQUErRDtBQUMvRCxNQUFNLFdBQVcsR0FBRyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQU1wRSxNQUFNLE9BQU8sb0JBQW9CO0lBcUcvQixZQUFvQixRQUFrQixFQUFVLEdBQTZCLEVBQ25FLE1BQXNCLEVBQVUsS0FBdUIsRUFBVSxLQUFpQixFQUNsRixRQUE0QjtRQUZsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBMEI7UUFDbkUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDbEYsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFwRzlCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRy9CLHlCQUFvQixHQUFZLEtBQUssQ0FBQztRQUlyQyxZQUFPLEdBQVcsT0FBTyxDQUFDO1FBQzFCLGFBQVEsR0FBVyxNQUFNLENBQUM7UUFFMUIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCLHNCQUFpQixHQUFRLEVBQUUsQ0FB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RyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csb0JBQW9CO3NCQUE1QixLQUFLO2dCQUNHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFRyx3QkFBd0I7c0JBQWhDLEtBQUs7Z0JBRUcsZUFBZTtzQkFBdkIsS0FBSztnQkFDZSxVQUFVO3NCQUE5QixLQUFLO3VCQUFDLFlBQVk7Z0JBQ0UsVUFBVTtzQkFBOUIsS0FBSzt1QkFBQyxZQUFZO2dCQUNJLFlBQVk7c0JBQWxDLEtBQUs7dUJBQUMsY0FBYztnQkFFWCxhQUFhO3NCQUF0QixNQUFNO2dCQUVHLGNBQWM7c0JBQXZCLE1BQU07Z0JBRUcsY0FBYztzQkFBdkIsTUFBTTtnQkFDRyxlQUFlO3NCQUF4QixNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFRyxlQUFlO3NCQUF4QixNQUFNO2dCQUNHLGdCQUFnQjtzQkFBekIsTUFBTTtnQkFFRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBQ0csaUJBQWlCO3NCQUExQixNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBRUcsb0JBQW9CO3NCQUE3QixNQUFNO2dCQUVnQixXQUFXO3NCQUFqQyxZQUFZO3VCQUFDLE9BQU87Z0JBSUUsV0FBVztzQkFBakMsWUFBWTt1QkFBQyxPQUFPO2dCQUljLFdBQVc7c0JBQTdDLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLFxyXG4gIEhvc3RMaXN0ZW5lciwgQXBwbGljYXRpb25SZWYsIENvbXBvbmVudFJlZiwgRWxlbWVudFJlZiwgVmlld0NvbnRhaW5lclJlZixcclxuICBJbmplY3RvciwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBFbWJlZGRlZFZpZXdSZWYsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb2xvclBpY2tlclNlcnZpY2UgfSBmcm9tICcuL2NvbG9yLXBpY2tlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29sb3JQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXBpY2tlci5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgQWxwaGFDaGFubmVsLCBDb2xvck1vZGUsIE91dHB1dEZvcm1hdCB9IGZyb20gJy4vaGVscGVycyc7XHJcblxyXG4vLyBDYXJldGFrZXIgbm90ZTogd2UgaGF2ZSBzdGlsbCBsZWZ0IHRoZSBgdHlwZW9mYCBjb25kaXRpb24gaW4gb3JkZXIgdG8gYXZvaWRcclxuLy8gY3JlYXRpbmcgYSBicmVha2luZyBjaGFuZ2UgZm9yIHByb2plY3RzIHRoYXQgc3RpbGwgdXNlIHRoZSBWaWV3IEVuZ2luZS5cclxuLy8gVGhlIGBuZ0Rldk1vZGVgIGlzIGFsd2F5cyBhdmFpbGFibGUgd2hlbiBJdnkgaXMgZW5hYmxlZC5cclxuLy8gVGhpcyB3aWxsIGJlIGV2YWx1YXRlZCBkdXJpbmcgY29tcGlsYXRpb24gaW50byBgY29uc3QgTkdfREVWX01PREUgPSBmYWxzZWAsXHJcbi8vIHRodXMgVGVyc2VyIHdpbGwgYmUgYWJsZSB0byB0cmVlLXNoYWtlIGBjb25zb2xlLndhcm5gIGNhbGxzLlxyXG5jb25zdCBOR19ERVZfTU9ERSA9IHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8ICEhbmdEZXZNb2RlO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbY29sb3JQaWNrZXJdJyxcclxuICBleHBvcnRBczogJ25neENvbG9yUGlja2VyJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29sb3JQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBkaWFsb2c6IGFueTtcclxuXHJcbiAgcHJpdmF0ZSBkaWFsb2dDcmVhdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpZ25vcmVDaGFuZ2VzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgY21wUmVmOiBDb21wb25lbnRSZWY8Q29sb3JQaWNrZXJDb21wb25lbnQ+O1xyXG4gIHByaXZhdGUgdmlld0F0dGFjaGVkVG9BcHBSZWY6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY29sb3JQaWNrZXI6IHN0cmluZztcclxuXHJcbiAgQElucHV0KCkgY3BXaWR0aDogc3RyaW5nID0gJzIzMHB4JztcclxuICBASW5wdXQoKSBjcEhlaWdodDogc3RyaW5nID0gJ2F1dG8nO1xyXG5cclxuICBASW5wdXQoKSBjcFRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BJZ25vcmVkRWxlbWVudHM6IGFueSA9IFtdO1xyXG5cclxuICBASW5wdXQoKSBjcEZhbGxiYWNrQ29sb3I6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASW5wdXQoKSBjcENvbG9yTW9kZTogQ29sb3JNb2RlID0gJ2NvbG9yJztcclxuXHJcbiAgQElucHV0KCkgY3BDbXlrRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcE91dHB1dEZvcm1hdDogT3V0cHV0Rm9ybWF0ID0gJ2F1dG8nO1xyXG4gIEBJbnB1dCgpIGNwQWxwaGFDaGFubmVsOiBBbHBoYUNoYW5uZWwgPSAnZW5hYmxlZCc7XHJcblxyXG4gIEBJbnB1dCgpIGNwRGlzYWJsZUlucHV0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNwRGlhbG9nRGlzcGxheTogc3RyaW5nID0gJ3BvcHVwJztcclxuXHJcbiAgQElucHV0KCkgY3BTYXZlQ2xpY2tPdXRzaWRlOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBjcENsb3NlQ2xpY2tPdXRzaWRlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KCkgY3BVc2VSb290Vmlld0NvbnRhaW5lcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcFBvc2l0aW9uOiBzdHJpbmcgPSAnYXV0byc7XHJcbiAgQElucHV0KCkgY3BQb3NpdGlvbk9mZnNldDogc3RyaW5nID0gJzAlJztcclxuICBASW5wdXQoKSBjcFBvc2l0aW9uUmVsYXRpdmVUb0Fycm93OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNwT0tCdXR0b246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBjcE9LQnV0dG9uVGV4dDogc3RyaW5nID0gJ09LJztcclxuICBASW5wdXQoKSBjcE9LQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1vay1idXR0b24tY2xhc3MnO1xyXG5cclxuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNwQ2FuY2VsQnV0dG9uVGV4dDogc3RyaW5nID0gJ0NhbmNlbCc7XHJcbiAgQElucHV0KCkgY3BDYW5jZWxCdXR0b25DbGFzczogc3RyaW5nID0gJ2NwLWNhbmNlbC1idXR0b24tY2xhc3MnO1xyXG5cclxuICBASW5wdXQoKSBjcEV5ZURyb3BwZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BQcmVzZXRMYWJlbDogc3RyaW5nID0gJ1ByZXNldCBjb2xvcnMnO1xyXG4gIEBJbnB1dCgpIGNwUHJlc2V0Q29sb3JzOiBzdHJpbmdbXTtcclxuICBASW5wdXQoKSBjcFByZXNldENvbG9yc0NsYXNzOiBzdHJpbmcgPSAnY3AtcHJlc2V0LWNvbG9ycy1jbGFzcyc7XHJcbiAgQElucHV0KCkgY3BNYXhQcmVzZXRDb2xvcnNMZW5ndGg6IG51bWJlciA9IDY7XHJcblxyXG4gIEBJbnB1dCgpIGNwUHJlc2V0RW1wdHlNZXNzYWdlOiBzdHJpbmcgPSAnTm8gY29sb3JzIGFkZGVkJztcclxuICBASW5wdXQoKSBjcFByZXNldEVtcHR5TWVzc2FnZUNsYXNzOiBzdHJpbmcgPSAncHJlc2V0LWVtcHR5LW1lc3NhZ2UnO1xyXG5cclxuICBASW5wdXQoKSBjcEFkZENvbG9yQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgY3BBZGRDb2xvckJ1dHRvblRleHQ6IHN0cmluZyA9ICdBZGQgY29sb3InO1xyXG4gIEBJbnB1dCgpIGNwQWRkQ29sb3JCdXR0b25DbGFzczogc3RyaW5nID0gJ2NwLWFkZC1jb2xvci1idXR0b24tY2xhc3MnO1xyXG5cclxuICBASW5wdXQoKSBjcFJlbW92ZUNvbG9yQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1yZW1vdmUtY29sb3ItYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BFeHRyYVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgnaGVhZGVyTmFtZScpIGhlYWRlck5hbWU6c3RyaW5nID0gJ0VkaXQgQ29sb3InO1xyXG4gIEBJbnB1dCgnc2F2ZUJ0blR4dCcpIHNhdmVCdG5UeHQ6IHN0cmluZyA9IFwiJ1NhdmUnXCI7XHJcbiAgQElucHV0KCdjYW5jZWxCdG5UeHQnKSBjYW5jZWxCdG5UeHQ6IHN0cmluZyA9IFwiJ0NhbmNlbCdcIlxyXG5cclxuICBAT3V0cHV0KCkgY3BJbnB1dENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8e2lucHV0OiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsIGNvbG9yOiBzdHJpbmd9Pih0cnVlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNwVG9nZ2xlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPih0cnVlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNwU2xpZGVyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7c2xpZGVyOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsIGNvbG9yOiBzdHJpbmd9Pih0cnVlKTtcclxuICBAT3V0cHV0KCkgY3BTbGlkZXJEcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjx7c2xpZGVyOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmd9Pih0cnVlKTtcclxuICBAT3V0cHV0KCkgY3BTbGlkZXJEcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPHtzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZ30+KHRydWUpO1xyXG5cclxuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJPcGVuID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xyXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlckNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xyXG5cclxuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJDYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XHJcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xyXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPihmYWxzZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjcENteWtDb2xvckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNwUHJlc2V0Q29sb3JzQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KHRydWUpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycpIGhhbmRsZUNsaWNrKCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dEZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdmb2N1cycpIGhhbmRsZUZvY3VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dEZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pIGhhbmRsZUlucHV0KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRDaGFuZ2UoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgY2ZyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXHJcbiAgICBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBDb2xvclBpY2tlclNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY21wUmVmICE9IG51bGwpIHtcclxuICAgICAgaWYgKHRoaXMudmlld0F0dGFjaGVkVG9BcHBSZWYpIHtcclxuICAgICAgICB0aGlzLmFwcFJlZi5kZXRhY2hWaWV3KHRoaXMuY21wUmVmLmhvc3RWaWV3KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jbXBSZWYuZGVzdHJveSgpO1xyXG5cclxuICAgICAgdGhpcy5jbXBSZWYgPSBudWxsO1xyXG4gICAgICB0aGlzLmRpYWxvZyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmIChjaGFuZ2VzLmNwVG9nZ2xlICYmICF0aGlzLmNwRGlzYWJsZWQpIHtcclxuICAgICAgaWYgKGNoYW5nZXMuY3BUb2dnbGUuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWNoYW5nZXMuY3BUb2dnbGUuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZURpYWxvZygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuY29sb3JQaWNrZXIpIHtcclxuICAgICAgaWYgKHRoaXMuZGlhbG9nICYmICF0aGlzLmlnbm9yZUNoYW5nZXMpIHtcclxuICAgICAgICBpZiAodGhpcy5jcERpYWxvZ0Rpc3BsYXkgPT09ICdpbmxpbmUnKSB7XHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRJbml0aWFsQ29sb3IoY2hhbmdlcy5jb2xvclBpY2tlci5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaWFsb2cuc2V0Q29sb3JGcm9tU3RyaW5nKGNoYW5nZXMuY29sb3JQaWNrZXIuY3VycmVudFZhbHVlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNwVXNlUm9vdFZpZXdDb250YWluZXIgJiYgdGhpcy5jcERpYWxvZ0Rpc3BsYXkgIT09ICdpbmxpbmUnKSB7XHJcbiAgICAgICAgICB0aGlzLmNtcFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmlnbm9yZUNoYW5nZXMgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5jcFByZXNldExhYmVsIHx8IGNoYW5nZXMuY3BQcmVzZXRDb2xvcnMpIHtcclxuICAgICAgaWYgKHRoaXMuZGlhbG9nKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2cuc2V0UHJlc2V0Q29uZmlnKHRoaXMuY3BQcmVzZXRMYWJlbCwgdGhpcy5jcFByZXNldENvbG9ycyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvcGVuRGlhbG9nKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmRpYWxvZ0NyZWF0ZWQpIHtcclxuICAgICAgbGV0IHZjUmVmID0gdGhpcy52Y1JlZjtcclxuXHJcbiAgICAgIHRoaXMuZGlhbG9nQ3JlYXRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMudmlld0F0dGFjaGVkVG9BcHBSZWYgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNwVXNlUm9vdFZpZXdDb250YWluZXIgJiYgdGhpcy5jcERpYWxvZ0Rpc3BsYXkgIT09ICdpbmxpbmUnKSB7XHJcbiAgICAgICAgY29uc3QgY2xhc3NPZlJvb3RDb21wb25lbnQgPSB0aGlzLmFwcFJlZi5jb21wb25lbnRUeXBlc1swXTtcclxuICAgICAgICBjb25zdCBhcHBJbnN0YW5jZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KGNsYXNzT2ZSb290Q29tcG9uZW50LCBJbmplY3Rvci5OVUxMKTtcclxuXHJcbiAgICAgICAgaWYgKGFwcEluc3RhbmNlICE9PSBJbmplY3Rvci5OVUxMKSB7XHJcbiAgICAgICAgICB2Y1JlZiA9IGFwcEluc3RhbmNlLnZjUmVmIHx8IGFwcEluc3RhbmNlLnZpZXdDb250YWluZXJSZWYgfHwgdGhpcy52Y1JlZjtcclxuXHJcbiAgICAgICAgICBpZiAoTkdfREVWX01PREUgJiYgdmNSZWYgPT09IHRoaXMudmNSZWYpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdZb3UgYXJlIHVzaW5nIGNwVXNlUm9vdFZpZXdDb250YWluZXIsICcgK1xyXG4gICAgICAgICAgICAgICdidXQgdGhlIHJvb3QgY29tcG9uZW50IGlzIG5vdCBleHBvc2luZyB2aWV3Q29udGFpbmVyUmVmIScgK1xyXG4gICAgICAgICAgICAgICdQbGVhc2UgZXhwb3NlIGl0IGJ5IGFkZGluZyBcXCdwdWJsaWMgdmNSZWY6IFZpZXdDb250YWluZXJSZWZcXCcgdG8gdGhlIGNvbnN0cnVjdG9yLicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGNvbXBGYWN0b3J5ID0gdGhpcy5jZnIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoQ29sb3JQaWNrZXJDb21wb25lbnQpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudmlld0F0dGFjaGVkVG9BcHBSZWYpIHtcclxuICAgICAgICB0aGlzLmNtcFJlZiA9IGNvbXBGYWN0b3J5LmNyZWF0ZSh0aGlzLmluamVjdG9yKTtcclxuICAgICAgICB0aGlzLmFwcFJlZi5hdHRhY2hWaWV3KHRoaXMuY21wUmVmLmhvc3RWaWV3KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCh0aGlzLmNtcFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XHJcbiAgICAgICAgICBwcm92aWRlcnM6IFtdLFxyXG4gICAgICAgICAgLy8gV2Ugc2hvdWxkbid0IHVzZSBgdmNSZWYucGFyZW50SW5qZWN0b3JgIHNpbmNlIGl0J3MgYmVlbiBkZXByZWNhdGVkIGxvbmcgdGltZSBhZ28gYW5kIG1pZ2h0IGJlIHJlbW92ZWRcclxuICAgICAgICAgIC8vIGluIG5ld2VyIEFuZ3VsYXIgdmVyc2lvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8yNTE3NC5cclxuICAgICAgICAgIHBhcmVudDogdmNSZWYuaW5qZWN0b3IsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY21wUmVmID0gdmNSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBGYWN0b3J5LCAwLCBpbmplY3RvciwgW10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNtcFJlZi5pbnN0YW5jZS5zZXR1cERpYWxvZyh0aGlzLCB0aGlzLmVsUmVmLCB0aGlzLmNvbG9yUGlja2VyLFxyXG4gICAgICAgIHRoaXMuY3BXaWR0aCwgdGhpcy5jcEhlaWdodCwgdGhpcy5jcERpYWxvZ0Rpc3BsYXksIHRoaXMuY3BGYWxsYmFja0NvbG9yLCB0aGlzLmNwQ29sb3JNb2RlLFxyXG4gICAgICAgIHRoaXMuY3BDbXlrRW5hYmxlZCwgdGhpcy5jcEFscGhhQ2hhbm5lbCwgdGhpcy5jcE91dHB1dEZvcm1hdCwgdGhpcy5jcERpc2FibGVJbnB1dCxcclxuICAgICAgICB0aGlzLmNwSWdub3JlZEVsZW1lbnRzLCB0aGlzLmNwU2F2ZUNsaWNrT3V0c2lkZSwgdGhpcy5jcENsb3NlQ2xpY2tPdXRzaWRlLFxyXG4gICAgICAgIHRoaXMuY3BVc2VSb290Vmlld0NvbnRhaW5lciwgdGhpcy5jcFBvc2l0aW9uLCB0aGlzLmNwUG9zaXRpb25PZmZzZXQsXHJcbiAgICAgICAgdGhpcy5jcFBvc2l0aW9uUmVsYXRpdmVUb0Fycm93LCB0aGlzLmNwUHJlc2V0TGFiZWwsIHRoaXMuY3BQcmVzZXRDb2xvcnMsXHJcbiAgICAgICAgdGhpcy5jcFByZXNldENvbG9yc0NsYXNzLCB0aGlzLmNwTWF4UHJlc2V0Q29sb3JzTGVuZ3RoLCB0aGlzLmNwUHJlc2V0RW1wdHlNZXNzYWdlLFxyXG4gICAgICAgIHRoaXMuY3BQcmVzZXRFbXB0eU1lc3NhZ2VDbGFzcywgdGhpcy5jcE9LQnV0dG9uLCB0aGlzLmNwT0tCdXR0b25DbGFzcyxcclxuICAgICAgICB0aGlzLmNwT0tCdXR0b25UZXh0LCB0aGlzLmNwQ2FuY2VsQnV0dG9uLCB0aGlzLmNwQ2FuY2VsQnV0dG9uQ2xhc3MsXHJcbiAgICAgICAgdGhpcy5jcENhbmNlbEJ1dHRvblRleHQsIHRoaXMuY3BBZGRDb2xvckJ1dHRvbiwgdGhpcy5jcEFkZENvbG9yQnV0dG9uQ2xhc3MsXHJcbiAgICAgICAgdGhpcy5jcEFkZENvbG9yQnV0dG9uVGV4dCwgdGhpcy5jcFJlbW92ZUNvbG9yQnV0dG9uQ2xhc3MsIHRoaXMuY3BFeWVEcm9wcGVyLCB0aGlzLmVsUmVmLFxyXG4gICAgICAgIHRoaXMuY3BFeHRyYVRlbXBsYXRlLHRoaXMuaGVhZGVyTmFtZSx0aGlzLnNhdmVCdG5UeHQsdGhpcy5jYW5jZWxCdG5UeHQpO1xyXG5cclxuICAgICAgdGhpcy5kaWFsb2cgPSB0aGlzLmNtcFJlZi5pbnN0YW5jZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnZjUmVmICE9PSB2Y1JlZikge1xyXG4gICAgICAgIHRoaXMuY21wUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmRpYWxvZykge1xyXG4gICAgICB0aGlzLmRpYWxvZy5vcGVuRGlhbG9nKHRoaXMuY29sb3JQaWNrZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlRGlhbG9nKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuZGlhbG9nICYmIHRoaXMuY3BEaWFsb2dEaXNwbGF5ID09PSAncG9wdXAnKSB7XHJcbiAgICAgIHRoaXMuZGlhbG9nLmNsb3NlRGlhbG9nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY215a0NoYW5nZWQodmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5jcENteWtDb2xvckNoYW5nZS5lbWl0KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0ZUNoYW5nZWQoc3RhdGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuY3BUb2dnbGVDaGFuZ2UuZW1pdChzdGF0ZSk7XHJcblxyXG4gICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgIHRoaXMuY29sb3JQaWNrZXJPcGVuLmVtaXQodGhpcy5jb2xvclBpY2tlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbG9yUGlja2VyQ2xvc2UuZW1pdCh0aGlzLmNvbG9yUGlja2VyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb2xvckNoYW5nZWQodmFsdWU6IHN0cmluZywgaWdub3JlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5pZ25vcmVDaGFuZ2VzID0gaWdub3JlO1xyXG5cclxuICAgIHRoaXMuY29sb3JQaWNrZXJDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29sb3JTZWxlY3RlZCh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9yUGlja2VyU2VsZWN0LmVtaXQodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbG9yQ2FuY2VsZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9yUGlja2VyQ2FuY2VsLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbnB1dEZvY3VzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudDtcclxuXHJcbiAgICBjb25zdCBpZ25vcmVkID0gdGhpcy5jcElnbm9yZWRFbGVtZW50cy5maWx0ZXIoKGl0ZW06IGFueSkgPT4gaXRlbSA9PT0gZWxlbWVudCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmNwRGlzYWJsZWQgJiYgIWlnbm9yZWQubGVuZ3RoKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGVsZW1lbnQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLm9wZW5EaWFsb2coKTtcclxuICAgICAgfSBlbHNlIGlmICghdGhpcy5kaWFsb2cgfHwgIXRoaXMuZGlhbG9nLnNob3cpIHtcclxuICAgICAgICB0aGlzLm9wZW5EaWFsb2coKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNsb3NlRGlhbG9nKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbnB1dENoYW5nZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5kaWFsb2cpIHtcclxuICAgICAgdGhpcy5kaWFsb2cuc2V0Q29sb3JGcm9tU3RyaW5nKGV2ZW50LnRhcmdldC52YWx1ZSwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbG9yUGlja2VyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgICAgdGhpcy5jb2xvclBpY2tlckNoYW5nZS5lbWl0KHRoaXMuY29sb3JQaWNrZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGlucHV0Q2hhbmdlZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmNwSW5wdXRDaGFuZ2UuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2xpZGVyQ2hhbmdlZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmNwU2xpZGVyQ2hhbmdlLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNsaWRlckRyYWdFbmQoZXZlbnQ6IHsgc2xpZGVyOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgfSk6IHZvaWQge1xyXG4gICAgdGhpcy5jcFNsaWRlckRyYWdFbmQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2xpZGVyRHJhZ1N0YXJ0KGV2ZW50OiB7IHNsaWRlcjogc3RyaW5nLCBjb2xvcjogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIHRoaXMuY3BTbGlkZXJEcmFnU3RhcnQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcHJlc2V0Q29sb3JzQ2hhbmdlZCh2YWx1ZTogYW55W10pOiB2b2lkIHtcclxuICAgIHRoaXMuY3BQcmVzZXRDb2xvcnNDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==