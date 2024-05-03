/*
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"
import window from '@ohos.window';
import display from '@ohos.display';
import { BusinessError } from '@kit.BasicServicesKit';

export class RNOrientationTurboModule extends TurboModule implements TM.ReactNativeOrientation.Spec {
  constructor(ctx) {
    super(ctx)
  }

  private windowClass: window.Window | undefined = undefined;

  private initDisplayListener() {
    display.on('change', () => {
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getOrientationString(displayValue.orientation);
      this.ctx.rnInstance.emitDeviceEvent('orientationDidChange', { orientation: displayValueString })
    })
  }

  private initSpecificDisplayListener() {
    display.on('change', () => {
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getSpecificOrientationString(displayValue.orientation);
      this.ctx.rnInstance.emitDeviceEvent('specificOrientationDidChange', { specificOrientation: displayValueString })
    })
  }

  private async setWindowClass(): Promise<void> {
    let context = this.ctx.uiAbilityContext;
    let promise = await window.getLastWindow(context);
    this.windowClass = promise;
    return;
  }

  private getOrientationString(orientation: number): string {
    if (orientation === 0) {
      return 'PORTRAIT';
    } else if (orientation === 1) {
      return 'LANDSCAPE';
    } else if (orientation === 2) {
      return 'PORTRAIT';
    } else if (orientation === 3) {
      return 'LANDSCAPE';
    } else {
      return 'UNKNOWN';
    }
  }

  private getSpecificOrientationString(orientation: number): string {
    if (orientation === 0) {
      return 'PORTRAIT';
    } else if (orientation === 1) {
      return 'LANDSCAPE_LEFT';
    } else if (orientation === 2) {
      return 'PORTRAIT_INVERTED';
    } else if (orientation === 3) {
      return 'LANDSCAPE_RIGHT';
    } else {
      return 'UNKNOWN';
    }
  }

  getOrientation(callback: (err: string, orientation: string) => void): void {
    let displayClass: display.Display | null = null;
    let err: string | null = null;
    try {
      displayClass = display.getDefaultDisplaySync();
      let AppOrientation = this.getOrientationString(displayClass.orientation);
      callback(err, AppOrientation);
    } catch (e) {
      callback(e, null);
    }
  }

  getSpecificOrientation(callback: (err: string, orientation: string) => void): void {
    let displayClass: display.Display | null = null;
    let err: string | null = null;
    try {
      displayClass = display.getDefaultDisplaySync();
      let SpecificAppOrientation = this.getSpecificOrientationString(displayClass.orientation);
      callback(err, SpecificAppOrientation);
    } catch (e) {
      callback(e, null);
    }
  }

  lockToPortrait(): void {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        let orientation: window.Orientation = window.Orientation.PORTRAIT;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
        });
      }
    })
  }

  lockToLandscape(): void {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        let orientation: window.Orientation = window.Orientation.AUTO_ROTATION_LANDSCAPE_RESTRICTED;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
        });
      }
    })

  }

  lockToLandscapeLeft(): void {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        let orientation: window.Orientation = window.Orientation.LANDSCAPE;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
        });
      }
    })
  }

  lockToLandscapeRight(): void {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        let orientation: window.Orientation = window.Orientation.LANDSCAPE_INVERTED;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
        });
      }
    })
  }

  unlockAllOrientations(): void {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        let orientation: window.Orientation = window.Orientation.AUTO_ROTATION;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
        });
      }
    })
  }

  addOrientationListener(): void {
    this.initDisplayListener()
  }

  addSpecificOrientationListener(): void {
    this.initSpecificDisplayListener();
  }

  removeOrientationListener(): void {
    display.off('change', () => {
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getOrientationString(displayValue.orientation);
      this.ctx.rnInstance.emitDeviceEvent('orientationDidChange', { orientation: displayValueString })
    })
  }

  removeSpecificOrientationListener(): void {
    display.off('change', () => {
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getSpecificOrientationString(displayValue.orientation);
      this.ctx.rnInstance.emitDeviceEvent('specificOrientationDidChange', { specificOrientation: displayValueString })
    })
  }
}