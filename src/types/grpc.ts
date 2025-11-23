import { GRPCMethod } from '../constants/grpc.js';

/**
 * Helper class containing necessary data for Google RPC calls
 */
export class RPCData {
  rpcid: GRPCMethod;
  payload: string;
  identifier: string;

  constructor(data: { rpcid: GRPCMethod; payload: string; identifier?: string }) {
    this.rpcid = data.rpcid;
    this.payload = data.payload;
    this.identifier = data.identifier ?? 'generic';
  }

  toString(): string {
    return `GRPC(rpcid='${this.rpcid}', payload='${this.payload}', identifier='${this.identifier}')`;
  }

  /**
   * Serializes object into formatted payload ready for RPC call
   */
  serialize(): (string | null)[] {
    return [this.rpcid, this.payload, null, this.identifier];
  }
}
