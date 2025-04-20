import { ValueObject } from './ValueObject'

export interface ImageIdProps { id: string }

export class ImageId extends ValueObject<ImageIdProps> {
  get value() {
    return this.props.id
  }
}
