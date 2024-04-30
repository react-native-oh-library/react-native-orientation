import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {


  //获取应用程序方向
  getOrientation(callback:(orientation:string)=>void):void;
  
  //获取应用程序方向
  getSpecificOrientation(callback:(orientation:string)=>void):void;

  //锁定应用程序方向为纵向（竖屏）
  lockToPortrait(): void;

  //锁定应用程序方向为横向（横屏）
  lockToLandscape(): void;

  //锁定应用程序的方向为横向，并且是向左旋转的方向。
  lockToLandscapeLeft(): void;

  //锁定应用程序方向为横向，并且是向右旋转的方向
  lockToLandscapeRight(): void;

  //解锁所有方向
  unlockAllOrientations(): void;

  //开启屏幕方向监听
   addOrientationListener():void;

  //开启屏幕具体方向监听
   addSpecificOrientationListener():void;
 
  //移除屏幕方向监听
   removeOrientationListener():void;
 
  //移除屏幕具体方向监听
   removeSpecificOrientationListener():void;
}

export default TurboModuleRegistry.get<Spec>('ReactNativeOrientation') as Spec | null;