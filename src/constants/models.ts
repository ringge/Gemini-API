/**
 * Gemini model configurations
 */

export interface ModelConfig {
  modelName: string;
  modelHeader: Record<string, string>;
  advancedOnly: boolean;
}

export class Model implements ModelConfig {
  modelName: string;
  modelHeader: Record<string, string>;
  advancedOnly: boolean;

  constructor(name: string, header: Record<string, string>, advancedOnly: boolean = false) {
    this.modelName = name;
    this.modelHeader = header;
    this.advancedOnly = advancedOnly;
  }

  static UNSPECIFIED = new Model('unspecified', {}, false);

  static G_3_0_PRO = new Model(
    'gemini-3.0-pro',
    {
      'x-goog-ext-525001261-jspb': '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4]]',
    },
    false
  );

  static G_2_5_PRO = new Model(
    'gemini-2.5-pro',
    {
      'x-goog-ext-525001261-jspb': '[1,null,null,null,"4af6c7f5da75d65d",null,null,0,[4]]',
    },
    false
  );

  static G_2_5_FLASH = new Model(
    'gemini-2.5-flash',
    {
      'x-goog-ext-525001261-jspb': '[1,null,null,null,"9ec249fc9ad08861",null,null,0,[4]]',
    },
    false
  );

  /**
   * Get model by name
   */
  static fromName(name: string): Model {
    const models = [Model.UNSPECIFIED, Model.G_3_0_PRO, Model.G_2_5_PRO, Model.G_2_5_FLASH];

    for (const model of models) {
      if (model.modelName === name) {
        return model;
      }
    }

    const availableModels = models.map((m) => m.modelName).join(', ');
    throw new Error(`Unknown model name: ${name}. Available models: ${availableModels}`);
  }

  /**
   * Create custom model from dictionary
   */
  static fromDict(modelDict: Partial<ModelConfig>): Model {
    if (!modelDict.modelName || !modelDict.modelHeader) {
      throw new Error(
        "When passing a custom model as a dictionary, 'modelName' and 'modelHeader' keys must be provided."
      );
    }

    if (typeof modelDict.modelHeader !== 'object') {
      throw new Error(
        "When passing a custom model as a dictionary, 'modelHeader' must be an object containing valid header strings."
      );
    }

    return new Model(modelDict.modelName, modelDict.modelHeader, modelDict.advancedOnly ?? false);
  }
}

export type ModelInput = Model | string | Partial<ModelConfig>;
