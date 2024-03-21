import * as _139 from "./abci/types";
import * as _140 from "./blocksync/types";
import * as _141 from "./consensus/types";
import * as _142 from "./consensus/wal";
import * as _143 from "./crypto/keys";
import * as _144 from "./crypto/proof";
import * as _145 from "./libs/bits/types";
import * as _146 from "./mempool/types";
import * as _147 from "./p2p/conn";
import * as _148 from "./p2p/pex";
import * as _149 from "./p2p/types";
import * as _150 from "./privval/types";
import * as _151 from "./rpc/grpc/types";
import * as _152 from "./state/types";
import * as _153 from "./statesync/types";
import * as _154 from "./store/types";
import * as _155 from "./types/block";
import * as _156 from "./types/canonical";
import * as _157 from "./types/events";
import * as _158 from "./types/evidence";
import * as _159 from "./types/params";
import * as _160 from "./types/types";
import * as _161 from "./types/validator";
import * as _162 from "./version/types";
export namespace tendermint {
  export const abci = {
    ..._139
  };
  export const blocksync = {
    ..._140
  };
  export const consensus = {
    ..._141,
    ..._142
  };
  export const crypto = {
    ..._143,
    ..._144
  };
  export namespace libs {
    export const bits = {
      ..._145
    };
  }
  export const mempool = {
    ..._146
  };
  export const p2p = {
    ..._147,
    ..._148,
    ..._149
  };
  export const privval = {
    ..._150
  };
  export namespace rpc {
    export const grpc = {
      ..._151
    };
  }
  export const state = {
    ..._152
  };
  export const statesync = {
    ..._153
  };
  export const store = {
    ..._154
  };
  export const types = {
    ..._155,
    ..._156,
    ..._157,
    ..._158,
    ..._159,
    ..._160,
    ..._161
  };
  export const version = {
    ..._162
  };
}