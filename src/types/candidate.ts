import { decode } from 'html-entities';
import { Image, WebImage, GeneratedImage } from './image.js';

/**
 * A single reply candidate object in the model output
 */
export class Candidate {
  rcid: string;
  text: string;
  thoughts?: string;
  webImages: WebImage[];
  generatedImages: GeneratedImage[];

  constructor(data: {
    rcid: string;
    text: string;
    thoughts?: string;
    webImages?: WebImage[];
    generatedImages?: GeneratedImage[];
  }) {
    this.rcid = data.rcid;
    this.text = decode(data.text || '');
    this.thoughts = data.thoughts ? decode(data.thoughts) : undefined;
    this.webImages = data.webImages ?? [];
    this.generatedImages = data.generatedImages ?? [];
  }

  toString(): string {
    return this.text;
  }

  toJSON(): string {
    const truncatedText = this.text.length <= 20 ? this.text : `${this.text.substring(0, 20)}...`;
    return `Candidate(rcid='${this.rcid}', text='${truncatedText}', images=${this.images})`;
  }

  /**
   * Get all images (web + generated) in this candidate
   */
  get images(): Image[] {
    return [...this.webImages, ...this.generatedImages];
  }
}
