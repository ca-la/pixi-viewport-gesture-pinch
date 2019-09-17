export default class BasePlugin {
  constructor() {
  }

  public destroy(): void {}
  public down(): boolean { return false; }
  public move(): boolean { return false; }
  public up(): boolean { return false; }
  public wheel(): boolean { return false; }
  public update(): void {}
  public reset(): void {}
  public resize(): void {}
  public pause(): void {}
  public resume(): void {}
}
