export class Timer {
  private readonly start: Date;
  public constructor() {
    this.start = new Date();
  }
  public toString(): number {
    const end = new Date();
    return (end.getTime() - this.start.getTime()) / 1000;
  }
}
