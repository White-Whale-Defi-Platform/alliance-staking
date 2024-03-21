import * as _248 from './rpc.query';
import * as _249 from './rpc.tx';
import * as _104 from './wasm/v1/authz';
import * as _105 from './wasm/v1/genesis';
import * as _106 from './wasm/v1/ibc';
import * as _107 from './wasm/v1/proposal_legacy';
import * as _108 from './wasm/v1/query';
import * as _238 from './wasm/v1/query.lcd';
import * as _239 from './wasm/v1/query.rpc.Query';
import * as _109 from './wasm/v1/tx';
import * as _236 from './wasm/v1/tx.amino';
import * as _237 from './wasm/v1/tx.registry';
import * as _240 from './wasm/v1/tx.rpc.msg';
import * as _110 from './wasm/v1/types';
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = {
      ..._104,
      ..._105,
      ..._106,
      ..._107,
      ..._108,
      ..._109,
      ..._110,
      ..._236,
      ..._237,
      ..._238,
      ..._239,
      ..._240,
    };
  }
  export const ClientFactory = {
    ..._248,
    ..._249,
  };
}
