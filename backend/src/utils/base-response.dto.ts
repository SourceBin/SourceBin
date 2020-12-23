export class BaseResponseDto<T> {
  protected constructor(object: Readonly<T>) {
    Object.assign(this, object);
  }
}
