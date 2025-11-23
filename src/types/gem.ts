/**
 * Reusable Gemini Gem object working as a system prompt
 */
export class Gem {
  id: string;
  name: string;
  description?: string;
  prompt?: string;
  predefined: boolean;

  constructor(data: {
    id: string;
    name: string;
    description?: string;
    prompt?: string;
    predefined: boolean;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.prompt = data.prompt;
    this.predefined = data.predefined;
  }

  toString(): string {
    return `Gem(id='${this.id}', name='${this.name}', description='${this.description}', prompt='${this.prompt}', predefined=${this.predefined})`;
  }
}

/**
 * Helper class for handling a collection of Gem objects
 */
export class GemJar extends Map<string, Gem> {
  /**
   * Iterator over gems in the jar
   */
  [Symbol.iterator](): IterableIterator<Gem> {
    return this.values();
  }

  /**
   * Retrieve a gem by its id and/or name
   */
  get(id?: string, name?: string, defaultValue?: Gem): Gem | undefined {
    if (id === undefined && name === undefined) {
      throw new Error('At least one of gem id or name must be provided.');
    }

    if (id !== undefined) {
      const gemCandidate = super.get(id);
      if (gemCandidate) {
        if (name !== undefined) {
          return gemCandidate.name === name ? gemCandidate : defaultValue;
        }
        return gemCandidate;
      }
      return defaultValue;
    } else if (name !== undefined) {
      for (const gem of this.values()) {
        if (gem.name === name) {
          return gem;
        }
      }
      return defaultValue;
    }

    return defaultValue;
  }

  /**
   * Filter gems by predefined status or name
   */
  filter(options?: { predefined?: boolean; name?: string }): GemJar {
    const filtered = new GemJar();

    for (const [gemId, gem] of this.entries()) {
      if (options?.predefined !== undefined && gem.predefined !== options.predefined) {
        continue;
      }
      if (options?.name !== undefined && gem.name !== options.name) {
        continue;
      }
      filtered.set(gemId, gem);
    }

    return filtered;
  }
}

export type GemInput = Gem | string;
