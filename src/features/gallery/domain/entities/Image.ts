export interface ImageProps {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export class Image {
  constructor(public props: ImageProps) {}

  get id() {
    return this.props.id;
  }
  get author() {
    return this.props.author;
  }
  get url() {
    return this.props.url;
  }
  get downloadUrl() {
    return this.props.download_url;
  }
}
