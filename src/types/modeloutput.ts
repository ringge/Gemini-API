import { Candidate } from './candidate.js';
import { Image } from './image.js';

/**
 * Classified output from gemini.google.com
 */
export class ModelOutput {
  metadata: string[];
  candidates: Candidate[];
  chosen: number;

  constructor(data: { metadata: string[]; candidates: Candidate[]; chosen?: number }) {
    this.metadata = data.metadata;
    this.candidates = data.candidates;
    this.chosen = data.chosen ?? 0;
  }

  toString(): string {
    return this.text;
  }

  toJSON(): string {
    return `ModelOutput(metadata=${JSON.stringify(this.metadata)}, chosen=${this.chosen}, candidates=${this.candidates})`;
  }

  /**
   * Get text from the chosen candidate
   */
  get text(): string {
    return this.candidates[this.chosen]?.text ?? '';
  }

  /**
   * Get thoughts from the chosen candidate
   */
  get thoughts(): string | undefined {
    return this.candidates[this.chosen]?.thoughts;
  }

  /**
   * Get images from the chosen candidate
   */
  get images(): Image[] {
    return this.candidates[this.chosen]?.images ?? [];
  }

  /**
   * Get rcid from the chosen candidate
   */
  get rcid(): string {
    return this.candidates[this.chosen]?.rcid ?? '';
  }
}
