import { BinaryReader, BinaryWriter } from '../../binary';
import { Coin, CoinAmino, CoinSDKType } from '../../cosmos/base/v1beta1/coin';
import { Timestamp } from '../../google/protobuf/timestamp';
import { DeepPartial, toTimestamp, fromTimestamp } from '../../helpers';
/** Used internally to keep track of redelegations */
export interface QueuedRedelegation {
  entries: Redelegation[];
}
export interface QueuedRedelegationProtoMsg {
  typeUrl: '/alliance.alliance.QueuedRedelegation';
  value: Uint8Array;
}
/** Used internally to keep track of redelegations */
export interface QueuedRedelegationAmino {
  entries?: RedelegationAmino[];
}
export interface QueuedRedelegationAminoMsg {
  type: '/alliance.alliance.QueuedRedelegation';
  value: QueuedRedelegationAmino;
}
/** Used internally to keep track of redelegations */
export interface QueuedRedelegationSDKType {
  entries: RedelegationSDKType[];
}
export interface Redelegation {
  /** Internal or external user address */
  delegatorAddress: string;
  /** Redelegation source validator */
  srcValidatorAddress: string;
  /** Redelegation destination validator */
  dstValidatorAddress: string;
  /** Amount to redelegate */
  balance: Coin;
}
export interface RedelegationProtoMsg {
  typeUrl: '/alliance.alliance.Redelegation';
  value: Uint8Array;
}
export interface RedelegationAmino {
  /** Internal or external user address */
  delegator_address?: string;
  /** Redelegation source validator */
  src_validator_address?: string;
  /** Redelegation destination validator */
  dst_validator_address?: string;
  /** Amount to redelegate */
  balance?: CoinAmino;
}
export interface RedelegationAminoMsg {
  type: '/alliance.alliance.Redelegation';
  value: RedelegationAmino;
}
export interface RedelegationSDKType {
  delegator_address: string;
  src_validator_address: string;
  dst_validator_address: string;
  balance: CoinSDKType;
}
/** Used on QueryServer */
export interface RedelegationEntry {
  /** Internal or external user address */
  delegatorAddress: string;
  /** Redelegation source validator */
  srcValidatorAddress: string;
  /** Redelegation destination validator */
  dstValidatorAddress: string;
  /** Amount to redelegate */
  balance: Coin;
  /** Completion_time defines the unix time for redelegation completion. */
  completionTime: Date;
}
export interface RedelegationEntryProtoMsg {
  typeUrl: '/alliance.alliance.RedelegationEntry';
  value: Uint8Array;
}
/** Used on QueryServer */
export interface RedelegationEntryAmino {
  /** Internal or external user address */
  delegator_address?: string;
  /** Redelegation source validator */
  src_validator_address?: string;
  /** Redelegation destination validator */
  dst_validator_address?: string;
  /** Amount to redelegate */
  balance?: CoinAmino;
  /** Completion_time defines the unix time for redelegation completion. */
  completion_time?: string;
}
export interface RedelegationEntryAminoMsg {
  type: '/alliance.alliance.RedelegationEntry';
  value: RedelegationEntryAmino;
}
/** Used on QueryServer */
export interface RedelegationEntrySDKType {
  delegator_address: string;
  src_validator_address: string;
  dst_validator_address: string;
  balance: CoinSDKType;
  completion_time: Date;
}
function createBaseQueuedRedelegation(): QueuedRedelegation {
  return {
    entries: [],
  };
}
export const QueuedRedelegation = {
  typeUrl: '/alliance.alliance.QueuedRedelegation',
  encode(message: QueuedRedelegation, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.entries) {
      Redelegation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueuedRedelegation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueuedRedelegation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entries.push(Redelegation.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<QueuedRedelegation>): QueuedRedelegation {
    const message = createBaseQueuedRedelegation();
    message.entries = object.entries?.map((e) => Redelegation.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueuedRedelegationAmino): QueuedRedelegation {
    const message = createBaseQueuedRedelegation();
    message.entries = object.entries?.map((e) => Redelegation.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueuedRedelegation): QueuedRedelegationAmino {
    const obj: any = {};
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? Redelegation.toAmino(e) : undefined));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: QueuedRedelegationAminoMsg): QueuedRedelegation {
    return QueuedRedelegation.fromAmino(object.value);
  },
  fromProtoMsg(message: QueuedRedelegationProtoMsg): QueuedRedelegation {
    return QueuedRedelegation.decode(message.value);
  },
  toProto(message: QueuedRedelegation): Uint8Array {
    return QueuedRedelegation.encode(message).finish();
  },
  toProtoMsg(message: QueuedRedelegation): QueuedRedelegationProtoMsg {
    return {
      typeUrl: '/alliance.alliance.QueuedRedelegation',
      value: QueuedRedelegation.encode(message).finish(),
    };
  },
};
function createBaseRedelegation(): Redelegation {
  return {
    delegatorAddress: '',
    srcValidatorAddress: '',
    dstValidatorAddress: '',
    balance: Coin.fromPartial({}),
  };
}
export const Redelegation = {
  typeUrl: '/alliance.alliance.Redelegation',
  encode(message: Redelegation, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.srcValidatorAddress !== '') {
      writer.uint32(18).string(message.srcValidatorAddress);
    }
    if (message.dstValidatorAddress !== '') {
      writer.uint32(26).string(message.dstValidatorAddress);
    }
    if (message.balance !== undefined) {
      Coin.encode(message.balance, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Redelegation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.srcValidatorAddress = reader.string();
          break;
        case 3:
          message.dstValidatorAddress = reader.string();
          break;
        case 4:
          message.balance = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Redelegation>): Redelegation {
    const message = createBaseRedelegation();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.srcValidatorAddress = object.srcValidatorAddress ?? '';
    message.dstValidatorAddress = object.dstValidatorAddress ?? '';
    message.balance = object.balance !== undefined && object.balance !== null ? Coin.fromPartial(object.balance) : undefined;
    return message;
  },
  fromAmino(object: RedelegationAmino): Redelegation {
    const message = createBaseRedelegation();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.src_validator_address !== undefined && object.src_validator_address !== null) {
      message.srcValidatorAddress = object.src_validator_address;
    }
    if (object.dst_validator_address !== undefined && object.dst_validator_address !== null) {
      message.dstValidatorAddress = object.dst_validator_address;
    }
    if (object.balance !== undefined && object.balance !== null) {
      message.balance = Coin.fromAmino(object.balance);
    }
    return message;
  },
  toAmino(message: Redelegation): RedelegationAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.src_validator_address = message.srcValidatorAddress === '' ? undefined : message.srcValidatorAddress;
    obj.dst_validator_address = message.dstValidatorAddress === '' ? undefined : message.dstValidatorAddress;
    obj.balance = message.balance ? Coin.toAmino(message.balance) : undefined;
    return obj;
  },
  fromAminoMsg(object: RedelegationAminoMsg): Redelegation {
    return Redelegation.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationProtoMsg): Redelegation {
    return Redelegation.decode(message.value);
  },
  toProto(message: Redelegation): Uint8Array {
    return Redelegation.encode(message).finish();
  },
  toProtoMsg(message: Redelegation): RedelegationProtoMsg {
    return {
      typeUrl: '/alliance.alliance.Redelegation',
      value: Redelegation.encode(message).finish(),
    };
  },
};
function createBaseRedelegationEntry(): RedelegationEntry {
  return {
    delegatorAddress: '',
    srcValidatorAddress: '',
    dstValidatorAddress: '',
    balance: Coin.fromPartial({}),
    completionTime: new Date(),
  };
}
export const RedelegationEntry = {
  typeUrl: '/alliance.alliance.RedelegationEntry',
  encode(message: RedelegationEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.srcValidatorAddress !== '') {
      writer.uint32(18).string(message.srcValidatorAddress);
    }
    if (message.dstValidatorAddress !== '') {
      writer.uint32(26).string(message.dstValidatorAddress);
    }
    if (message.balance !== undefined) {
      Coin.encode(message.balance, writer.uint32(34).fork()).ldelim();
    }
    if (message.completionTime !== undefined) {
      Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): RedelegationEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegationEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.srcValidatorAddress = reader.string();
          break;
        case 3:
          message.dstValidatorAddress = reader.string();
          break;
        case 4:
          message.balance = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.completionTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<RedelegationEntry>): RedelegationEntry {
    const message = createBaseRedelegationEntry();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.srcValidatorAddress = object.srcValidatorAddress ?? '';
    message.dstValidatorAddress = object.dstValidatorAddress ?? '';
    message.balance = object.balance !== undefined && object.balance !== null ? Coin.fromPartial(object.balance) : undefined;
    message.completionTime = object.completionTime ?? undefined;
    return message;
  },
  fromAmino(object: RedelegationEntryAmino): RedelegationEntry {
    const message = createBaseRedelegationEntry();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.src_validator_address !== undefined && object.src_validator_address !== null) {
      message.srcValidatorAddress = object.src_validator_address;
    }
    if (object.dst_validator_address !== undefined && object.dst_validator_address !== null) {
      message.dstValidatorAddress = object.dst_validator_address;
    }
    if (object.balance !== undefined && object.balance !== null) {
      message.balance = Coin.fromAmino(object.balance);
    }
    if (object.completion_time !== undefined && object.completion_time !== null) {
      message.completionTime = fromTimestamp(Timestamp.fromAmino(object.completion_time));
    }
    return message;
  },
  toAmino(message: RedelegationEntry): RedelegationEntryAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.src_validator_address = message.srcValidatorAddress === '' ? undefined : message.srcValidatorAddress;
    obj.dst_validator_address = message.dstValidatorAddress === '' ? undefined : message.dstValidatorAddress;
    obj.balance = message.balance ? Coin.toAmino(message.balance) : undefined;
    obj.completion_time = message.completionTime ? Timestamp.toAmino(toTimestamp(message.completionTime)) : undefined;
    return obj;
  },
  fromAminoMsg(object: RedelegationEntryAminoMsg): RedelegationEntry {
    return RedelegationEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationEntryProtoMsg): RedelegationEntry {
    return RedelegationEntry.decode(message.value);
  },
  toProto(message: RedelegationEntry): Uint8Array {
    return RedelegationEntry.encode(message).finish();
  },
  toProtoMsg(message: RedelegationEntry): RedelegationEntryProtoMsg {
    return {
      typeUrl: '/alliance.alliance.RedelegationEntry',
      value: RedelegationEntry.encode(message).finish(),
    };
  },
};
