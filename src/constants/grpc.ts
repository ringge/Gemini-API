/**
 * Google RPC method IDs used in Gemini API
 */
export const GRPC = {
  // Chat methods
  LIST_CHATS: 'MaZiqc',
  READ_CHAT: 'hNvQHb',

  // Gem methods
  LIST_GEMS: 'CNgdBe',
  CREATE_GEM: 'oMH3Zd',
  UPDATE_GEM: 'kHv0Vd',
  DELETE_GEM: 'UXcSJb',
} as const;

export type GRPCMethod = (typeof GRPC)[keyof typeof GRPC];
