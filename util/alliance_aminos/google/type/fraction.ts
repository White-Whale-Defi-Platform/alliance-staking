import { BinaryReader, BinaryWriter } from "../../binary";
import { DeepPartial } from "../../helpers";
/** Represents a fraction in terms of a numerator divided by a denominator. */
export interface Fraction {
  /** The numerator in the fraction, e.g. 2 in 2/3. */
  numerator: bigint;
  /**
   * The value by which the numerator is divided, e.g. 3 in 2/3. Must be
   * positive.
   */
  denominator: bigint;
}
export interface FractionProtoMsg {
  typeUrl: "/google.type.Fraction";
  value: Uint8Array;
}
/** Represents a fraction in terms of a numerator divided by a denominator. */
export interface FractionAmino {
  /** The numerator in the fraction, e.g. 2 in 2/3. */
  numerator?: string;
  /**
   * The value by which the numerator is divided, e.g. 3 in 2/3. Must be
   * positive.
   */
  denominator?: string;
}
export interface FractionAminoMsg {
  type: "/google.type.Fraction";
  value: FractionAmino;
}
/** Represents a fraction in terms of a numerator divided by a denominator. */
export interface FractionSDKType {
  numerator: bigint;
  denominator: bigint;
}
function createBaseFraction(): Fraction {
  return {
    numerator: BigInt(0),
    denominator: BigInt(0)
  };
}
export const Fraction = {
  typeUrl: "/google.type.Fraction",
  encode(message: Fraction, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.numerator !== BigInt(0)) {
      writer.uint32(8).int64(message.numerator);
    }
    if (message.denominator !== BigInt(0)) {
      writer.uint32(16).int64(message.denominator);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Fraction {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFraction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.numerator = reader.int64();
          break;
        case 2:
          message.denominator = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Fraction>): Fraction {
    const message = createBaseFraction();
    message.numerator = object.numerator !== undefined && object.numerator !== null ? BigInt(object.numerator.toString()) : BigInt(0);
    message.denominator = object.denominator !== undefined && object.denominator !== null ? BigInt(object.denominator.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: FractionAmino): Fraction {
    const message = createBaseFraction();
    if (object.numerator !== undefined && object.numerator !== null) {
      message.numerator = BigInt(object.numerator);
    }
    if (object.denominator !== undefined && object.denominator !== null) {
      message.denominator = BigInt(object.denominator);
    }
    return message;
  },
  toAmino(message: Fraction): FractionAmino {
    const obj: any = {};
    obj.numerator = message.numerator !== BigInt(0) ? message.numerator.toString() : undefined;
    obj.denominator = message.denominator !== BigInt(0) ? message.denominator.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: FractionAminoMsg): Fraction {
    return Fraction.fromAmino(object.value);
  },
  fromProtoMsg(message: FractionProtoMsg): Fraction {
    return Fraction.decode(message.value);
  },
  toProto(message: Fraction): Uint8Array {
    return Fraction.encode(message).finish();
  },
  toProtoMsg(message: Fraction): FractionProtoMsg {
    return {
      typeUrl: "/google.type.Fraction",
      value: Fraction.encode(message).finish()
    };
  }
};