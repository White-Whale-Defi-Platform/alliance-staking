import { Duration, DurationAmino, DurationSDKType } from "../protobuf/duration";
import { BinaryReader, BinaryWriter } from "../../binary";
import { DeepPartial } from "../../helpers";
/**
 * Represents civil time (or occasionally physical time).
 * 
 * This type can represent a civil time in one of a few possible ways:
 * 
 *  * When utc_offset is set and time_zone is unset: a civil time on a calendar
 *    day with a particular offset from UTC.
 *  * When time_zone is set and utc_offset is unset: a civil time on a calendar
 *    day in a particular time zone.
 *  * When neither time_zone nor utc_offset is set: a civil time on a calendar
 *    day in local time.
 * 
 * The date is relative to the Proleptic Gregorian Calendar.
 * 
 * If year is 0, the DateTime is considered not to have a specific year. month
 * and day must have valid, non-zero values.
 * 
 * This type may also be used to represent a physical time if all the date and
 * time fields are set and either case of the `time_offset` oneof is set.
 * Consider using `Timestamp` message for physical time instead. If your use
 * case also would like to store the user's timezone, that can be done in
 * another field.
 * 
 * This type is more flexible than some applications may want. Make sure to
 * document and validate your application's limitations.
 */
export interface DateTime {
  /**
   * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a
   * datetime without a year.
   */
  year: number;
  /** Required. Month of year. Must be from 1 to 12. */
  month: number;
  /**
   * Required. Day of month. Must be from 1 to 31 and valid for the year and
   * month.
   */
  day: number;
  /**
   * Required. Hours of day in 24 hour format. Should be from 0 to 23. An API
   * may choose to allow the value "24:00:00" for scenarios like business
   * closing time.
   */
  hours: number;
  /** Required. Minutes of hour of day. Must be from 0 to 59. */
  minutes: number;
  /**
   * Required. Seconds of minutes of the time. Must normally be from 0 to 59. An
   * API may allow the value 60 if it allows leap-seconds.
   */
  seconds: number;
  /**
   * Required. Fractions of seconds in nanoseconds. Must be from 0 to
   * 999,999,999.
   */
  nanos: number;
  /**
   * UTC offset. Must be whole seconds, between -18 hours and +18 hours.
   * For example, a UTC offset of -4:00 would be represented as
   * { seconds: -14400 }.
   */
  utcOffset?: Duration;
  /** Time zone. */
  timeZone?: TimeZone;
}
export interface DateTimeProtoMsg {
  typeUrl: "/google.type.DateTime";
  value: Uint8Array;
}
/**
 * Represents civil time (or occasionally physical time).
 * 
 * This type can represent a civil time in one of a few possible ways:
 * 
 *  * When utc_offset is set and time_zone is unset: a civil time on a calendar
 *    day with a particular offset from UTC.
 *  * When time_zone is set and utc_offset is unset: a civil time on a calendar
 *    day in a particular time zone.
 *  * When neither time_zone nor utc_offset is set: a civil time on a calendar
 *    day in local time.
 * 
 * The date is relative to the Proleptic Gregorian Calendar.
 * 
 * If year is 0, the DateTime is considered not to have a specific year. month
 * and day must have valid, non-zero values.
 * 
 * This type may also be used to represent a physical time if all the date and
 * time fields are set and either case of the `time_offset` oneof is set.
 * Consider using `Timestamp` message for physical time instead. If your use
 * case also would like to store the user's timezone, that can be done in
 * another field.
 * 
 * This type is more flexible than some applications may want. Make sure to
 * document and validate your application's limitations.
 */
export interface DateTimeAmino {
  /**
   * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a
   * datetime without a year.
   */
  year?: number;
  /** Required. Month of year. Must be from 1 to 12. */
  month?: number;
  /**
   * Required. Day of month. Must be from 1 to 31 and valid for the year and
   * month.
   */
  day?: number;
  /**
   * Required. Hours of day in 24 hour format. Should be from 0 to 23. An API
   * may choose to allow the value "24:00:00" for scenarios like business
   * closing time.
   */
  hours?: number;
  /** Required. Minutes of hour of day. Must be from 0 to 59. */
  minutes?: number;
  /**
   * Required. Seconds of minutes of the time. Must normally be from 0 to 59. An
   * API may allow the value 60 if it allows leap-seconds.
   */
  seconds?: number;
  /**
   * Required. Fractions of seconds in nanoseconds. Must be from 0 to
   * 999,999,999.
   */
  nanos?: number;
  /**
   * UTC offset. Must be whole seconds, between -18 hours and +18 hours.
   * For example, a UTC offset of -4:00 would be represented as
   * { seconds: -14400 }.
   */
  utc_offset?: DurationAmino;
  /** Time zone. */
  time_zone?: TimeZoneAmino;
}
export interface DateTimeAminoMsg {
  type: "/google.type.DateTime";
  value: DateTimeAmino;
}
/**
 * Represents civil time (or occasionally physical time).
 * 
 * This type can represent a civil time in one of a few possible ways:
 * 
 *  * When utc_offset is set and time_zone is unset: a civil time on a calendar
 *    day with a particular offset from UTC.
 *  * When time_zone is set and utc_offset is unset: a civil time on a calendar
 *    day in a particular time zone.
 *  * When neither time_zone nor utc_offset is set: a civil time on a calendar
 *    day in local time.
 * 
 * The date is relative to the Proleptic Gregorian Calendar.
 * 
 * If year is 0, the DateTime is considered not to have a specific year. month
 * and day must have valid, non-zero values.
 * 
 * This type may also be used to represent a physical time if all the date and
 * time fields are set and either case of the `time_offset` oneof is set.
 * Consider using `Timestamp` message for physical time instead. If your use
 * case also would like to store the user's timezone, that can be done in
 * another field.
 * 
 * This type is more flexible than some applications may want. Make sure to
 * document and validate your application's limitations.
 */
export interface DateTimeSDKType {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  nanos: number;
  utc_offset?: DurationSDKType;
  time_zone?: TimeZoneSDKType;
}
/**
 * Represents a time zone from the
 * [IANA Time Zone Database](https://www.iana.org/time-zones).
 */
export interface TimeZone {
  /** IANA Time Zone Database time zone, e.g. "America/New_York". */
  id: string;
  /** Optional. IANA Time Zone Database version number, e.g. "2019a". */
  version: string;
}
export interface TimeZoneProtoMsg {
  typeUrl: "/google.type.TimeZone";
  value: Uint8Array;
}
/**
 * Represents a time zone from the
 * [IANA Time Zone Database](https://www.iana.org/time-zones).
 */
export interface TimeZoneAmino {
  /** IANA Time Zone Database time zone, e.g. "America/New_York". */
  id?: string;
  /** Optional. IANA Time Zone Database version number, e.g. "2019a". */
  version?: string;
}
export interface TimeZoneAminoMsg {
  type: "/google.type.TimeZone";
  value: TimeZoneAmino;
}
/**
 * Represents a time zone from the
 * [IANA Time Zone Database](https://www.iana.org/time-zones).
 */
export interface TimeZoneSDKType {
  id: string;
  version: string;
}
function createBaseDateTime(): DateTime {
  return {
    year: 0,
    month: 0,
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    nanos: 0,
    utcOffset: undefined,
    timeZone: undefined
  };
}
export const DateTime = {
  typeUrl: "/google.type.DateTime",
  encode(message: DateTime, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.year !== 0) {
      writer.uint32(8).int32(message.year);
    }
    if (message.month !== 0) {
      writer.uint32(16).int32(message.month);
    }
    if (message.day !== 0) {
      writer.uint32(24).int32(message.day);
    }
    if (message.hours !== 0) {
      writer.uint32(32).int32(message.hours);
    }
    if (message.minutes !== 0) {
      writer.uint32(40).int32(message.minutes);
    }
    if (message.seconds !== 0) {
      writer.uint32(48).int32(message.seconds);
    }
    if (message.nanos !== 0) {
      writer.uint32(56).int32(message.nanos);
    }
    if (message.utcOffset !== undefined) {
      Duration.encode(message.utcOffset, writer.uint32(66).fork()).ldelim();
    }
    if (message.timeZone !== undefined) {
      TimeZone.encode(message.timeZone, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DateTime {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDateTime();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.year = reader.int32();
          break;
        case 2:
          message.month = reader.int32();
          break;
        case 3:
          message.day = reader.int32();
          break;
        case 4:
          message.hours = reader.int32();
          break;
        case 5:
          message.minutes = reader.int32();
          break;
        case 6:
          message.seconds = reader.int32();
          break;
        case 7:
          message.nanos = reader.int32();
          break;
        case 8:
          message.utcOffset = Duration.decode(reader, reader.uint32());
          break;
        case 9:
          message.timeZone = TimeZone.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<DateTime>): DateTime {
    const message = createBaseDateTime();
    message.year = object.year ?? 0;
    message.month = object.month ?? 0;
    message.day = object.day ?? 0;
    message.hours = object.hours ?? 0;
    message.minutes = object.minutes ?? 0;
    message.seconds = object.seconds ?? 0;
    message.nanos = object.nanos ?? 0;
    message.utcOffset = object.utcOffset !== undefined && object.utcOffset !== null ? Duration.fromPartial(object.utcOffset) : undefined;
    message.timeZone = object.timeZone !== undefined && object.timeZone !== null ? TimeZone.fromPartial(object.timeZone) : undefined;
    return message;
  },
  fromAmino(object: DateTimeAmino): DateTime {
    const message = createBaseDateTime();
    if (object.year !== undefined && object.year !== null) {
      message.year = object.year;
    }
    if (object.month !== undefined && object.month !== null) {
      message.month = object.month;
    }
    if (object.day !== undefined && object.day !== null) {
      message.day = object.day;
    }
    if (object.hours !== undefined && object.hours !== null) {
      message.hours = object.hours;
    }
    if (object.minutes !== undefined && object.minutes !== null) {
      message.minutes = object.minutes;
    }
    if (object.seconds !== undefined && object.seconds !== null) {
      message.seconds = object.seconds;
    }
    if (object.nanos !== undefined && object.nanos !== null) {
      message.nanos = object.nanos;
    }
    if (object.utc_offset !== undefined && object.utc_offset !== null) {
      message.utcOffset = Duration.fromAmino(object.utc_offset);
    }
    if (object.time_zone !== undefined && object.time_zone !== null) {
      message.timeZone = TimeZone.fromAmino(object.time_zone);
    }
    return message;
  },
  toAmino(message: DateTime): DateTimeAmino {
    const obj: any = {};
    obj.year = message.year === 0 ? undefined : message.year;
    obj.month = message.month === 0 ? undefined : message.month;
    obj.day = message.day === 0 ? undefined : message.day;
    obj.hours = message.hours === 0 ? undefined : message.hours;
    obj.minutes = message.minutes === 0 ? undefined : message.minutes;
    obj.seconds = message.seconds === 0 ? undefined : message.seconds;
    obj.nanos = message.nanos === 0 ? undefined : message.nanos;
    obj.utc_offset = message.utcOffset ? Duration.toAmino(message.utcOffset) : undefined;
    obj.time_zone = message.timeZone ? TimeZone.toAmino(message.timeZone) : undefined;
    return obj;
  },
  fromAminoMsg(object: DateTimeAminoMsg): DateTime {
    return DateTime.fromAmino(object.value);
  },
  fromProtoMsg(message: DateTimeProtoMsg): DateTime {
    return DateTime.decode(message.value);
  },
  toProto(message: DateTime): Uint8Array {
    return DateTime.encode(message).finish();
  },
  toProtoMsg(message: DateTime): DateTimeProtoMsg {
    return {
      typeUrl: "/google.type.DateTime",
      value: DateTime.encode(message).finish()
    };
  }
};
function createBaseTimeZone(): TimeZone {
  return {
    id: "",
    version: ""
  };
}
export const TimeZone = {
  typeUrl: "/google.type.TimeZone",
  encode(message: TimeZone, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): TimeZone {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimeZone();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<TimeZone>): TimeZone {
    const message = createBaseTimeZone();
    message.id = object.id ?? "";
    message.version = object.version ?? "";
    return message;
  },
  fromAmino(object: TimeZoneAmino): TimeZone {
    const message = createBaseTimeZone();
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    return message;
  },
  toAmino(message: TimeZone): TimeZoneAmino {
    const obj: any = {};
    obj.id = message.id === "" ? undefined : message.id;
    obj.version = message.version === "" ? undefined : message.version;
    return obj;
  },
  fromAminoMsg(object: TimeZoneAminoMsg): TimeZone {
    return TimeZone.fromAmino(object.value);
  },
  fromProtoMsg(message: TimeZoneProtoMsg): TimeZone {
    return TimeZone.decode(message.value);
  },
  toProto(message: TimeZone): Uint8Array {
    return TimeZone.encode(message).finish();
  },
  toProtoMsg(message: TimeZone): TimeZoneProtoMsg {
    return {
      typeUrl: "/google.type.TimeZone",
      value: TimeZone.encode(message).finish()
    };
  }
};