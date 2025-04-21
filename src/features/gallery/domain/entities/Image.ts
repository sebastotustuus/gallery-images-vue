export interface ImageProps {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export class Image {
  constructor(public readonly props: ImageProps) {}

  get id() {
    return this.props.id;
  }
  
  get author() {
    return this.props.author;
  }
  
  get width() {
    return this.props.width;
  }
  
  get height() {
    return this.props.height;
  }
  
  get url() {
    return this.props.url;
  }
  
  get downloadUrl() {
    return this.props.download_url;
  }
  
  toJson(): ImageProps {
    return {
      id: this.id,
      author: this.author,
      width: this.width,
      height: this.height,
      url: this.url,
      download_url: this.downloadUrl
    };
  }
}
