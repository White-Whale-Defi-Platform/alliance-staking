import * as _12 from './app/runtime/v1alpha1/module';
import * as _13 from './auth/module/v1/module';
import * as _14 from './auth/v1beta1/auth';
import * as _15 from './auth/v1beta1/genesis';
import * as _16 from './auth/v1beta1/query';
import * as _192 from './auth/v1beta1/query.lcd';
import * as _207 from './auth/v1beta1/query.rpc.Query';
import * as _17 from './auth/v1beta1/tx';
import * as _168 from './auth/v1beta1/tx.amino';
import * as _180 from './auth/v1beta1/tx.registry';
import * as _223 from './auth/v1beta1/tx.rpc.msg';
import * as _18 from './authz/module/v1/module';
import * as _19 from './authz/v1beta1/authz';
import * as _20 from './authz/v1beta1/event';
import * as _21 from './authz/v1beta1/genesis';
import * as _22 from './authz/v1beta1/query';
import * as _193 from './authz/v1beta1/query.lcd';
import * as _208 from './authz/v1beta1/query.rpc.Query';
import * as _23 from './authz/v1beta1/tx';
import * as _224 from './authz/v1beta1/tx.rpc.msg';
import * as _24 from './bank/module/v1/module';
import * as _25 from './bank/v1beta1/authz';
import * as _26 from './bank/v1beta1/bank';
import * as _27 from './bank/v1beta1/genesis';
import * as _28 from './bank/v1beta1/query';
import * as _194 from './bank/v1beta1/query.lcd';
import * as _209 from './bank/v1beta1/query.rpc.Query';
import * as _29 from "./bank/v1beta1/tx";
import * as _30 from "./base/abci/v1beta1/abci";
import * as _31 from "./base/node/v1beta1/query";
import * as _32 from "./base/query/v1beta1/pagination";
import * as _33 from "./base/reflection/v2alpha1/reflection";
import * as _34 from "./base/v1beta1/coin";
import * as _35 from "./capability/module/v1/module";
import * as _36 from "./consensus/module/v1/module";
import * as _37 from "./consensus/v1/query";
import * as _38 from "./consensus/v1/tx";
import * as _39 from "./crisis/module/v1/module";
import * as _40 from "./crypto/ed25519/keys";
import * as _41 from "./crypto/hd/v1/hd";
import * as _42 from "./crypto/keyring/v1/record";
import * as _43 from "./crypto/multisig/keys";
import * as _44 from "./crypto/secp256k1/keys";
import * as _45 from "./crypto/secp256r1/keys";
import * as _46 from "./distribution/module/v1/module";
import * as _47 from "./distribution/v1beta1/distribution";
import * as _48 from "./distribution/v1beta1/genesis";
import * as _49 from "./distribution/v1beta1/query";
import * as _50 from "./distribution/v1beta1/tx";
import * as _51 from "./evidence/module/v1/module";
import * as _52 from "./feegrant/module/v1/module";
import * as _53 from "./feegrant/v1beta1/feegrant";
import * as _54 from "./feegrant/v1beta1/genesis";
import * as _55 from "./feegrant/v1beta1/query";
import * as _56 from "./feegrant/v1beta1/tx";
import * as _57 from "./genutil/module/v1/module";
import * as _58 from "./gov/module/v1/module";
import * as _59 from "./gov/v1/genesis";
import * as _60 from "./gov/v1/gov";
import * as _61 from "./gov/v1/query";
import * as _62 from "./gov/v1/tx";
import * as _63 from "./gov/v1beta1/genesis";
import * as _64 from "./gov/v1beta1/gov";
import * as _65 from "./gov/v1beta1/query";
import * as _66 from "./gov/v1beta1/tx";
import * as _67 from "./group/module/v1/module";
import * as _68 from "./group/v1/events";
import * as _69 from "./group/v1/genesis";
import * as _70 from "./group/v1/query";
import * as _71 from "./group/v1/tx";
import * as _72 from "./group/v1/types";
import * as _73 from "./mint/module/v1/module";
import * as _74 from "./mint/v1beta1/genesis";
import * as _75 from "./mint/v1beta1/mint";
import * as _76 from "./mint/v1beta1/query";
import * as _77 from "./mint/v1beta1/tx";
import * as _78 from "./nft/module/v1/module";
import * as _79 from "./orm/module/v1alpha1/module";
import * as _80 from "./orm/query/v1alpha1/query";
import * as _81 from "./params/module/v1/module";
import * as _82 from "./params/v1beta1/params";
import * as _83 from "./params/v1beta1/query";
import * as _84 from "./query/v1/query";
import * as _85 from "./reflection/v1/reflection";
import * as _86 from "./slashing/module/v1/module";
import * as _87 from "./staking/module/v1/module";
import * as _88 from "./staking/v1beta1/authz";
import * as _89 from "./staking/v1beta1/genesis";
import * as _90 from "./staking/v1beta1/query";
import * as _91 from "./staking/v1beta1/staking";
import * as _92 from "./staking/v1beta1/tx";
import * as _93 from "./tx/config/v1/config";
import * as _94 from "./tx/signing/v1beta1/signing";
import * as _95 from "./tx/v1beta1/service";
import * as _96 from "./tx/v1beta1/tx";
import * as _97 from "./upgrade/module/v1/module";
import * as _98 from "./upgrade/v1beta1/query";
import * as _99 from "./upgrade/v1beta1/tx";
import * as _100 from "./upgrade/v1beta1/upgrade";
import * as _101 from "./vesting/module/v1/module";
import * as _102 from "./vesting/v1beta1/tx";
import * as _103 from "./vesting/v1beta1/vesting";
import * as _169 from './bank/v1beta1/tx.amino';
import * as _170 from './consensus/v1/tx.amino';
import * as _171 from './distribution/v1beta1/tx.amino';
import * as _172 from './feegrant/v1beta1/tx.amino';
import * as _173 from './gov/v1/tx.amino';
import * as _174 from './gov/v1beta1/tx.amino';
import * as _175 from './group/v1/tx.amino';
import * as _176 from './mint/v1beta1/tx.amino';
import * as _177 from './staking/v1beta1/tx.amino';
import * as _178 from './upgrade/v1beta1/tx.amino';
import * as _179 from './vesting/v1beta1/tx.amino';
import * as _181 from './bank/v1beta1/tx.registry';
import * as _182 from './consensus/v1/tx.registry';
import * as _183 from './distribution/v1beta1/tx.registry';
import * as _184 from './feegrant/v1beta1/tx.registry';
import * as _185 from './gov/v1/tx.registry';
import * as _186 from './gov/v1beta1/tx.registry';
import * as _187 from './group/v1/tx.registry';
import * as _188 from './mint/v1beta1/tx.registry';
import * as _189 from './staking/v1beta1/tx.registry';
import * as _190 from './upgrade/v1beta1/tx.registry';
import * as _191 from './vesting/v1beta1/tx.registry';
import * as _195 from './base/node/v1beta1/query.lcd';
import * as _196 from './consensus/v1/query.lcd';
import * as _197 from './distribution/v1beta1/query.lcd';
import * as _198 from './feegrant/v1beta1/query.lcd';
import * as _199 from './gov/v1/query.lcd';
import * as _200 from './gov/v1beta1/query.lcd';
import * as _201 from './group/v1/query.lcd';
import * as _202 from './mint/v1beta1/query.lcd';
import * as _203 from './params/v1beta1/query.lcd';
import * as _204 from './staking/v1beta1/query.lcd';
import * as _205 from './tx/v1beta1/service.lcd';
import * as _206 from './upgrade/v1beta1/query.lcd';
import * as _210 from './base/node/v1beta1/query.rpc.Service';
import * as _211 from './consensus/v1/query.rpc.Query';
import * as _212 from './distribution/v1beta1/query.rpc.Query';
import * as _213 from './feegrant/v1beta1/query.rpc.Query';
import * as _214 from './gov/v1/query.rpc.Query';
import * as _215 from './gov/v1beta1/query.rpc.Query';
import * as _216 from './group/v1/query.rpc.Query';
import * as _217 from './mint/v1beta1/query.rpc.Query';
import * as _218 from './orm/query/v1alpha1/query.rpc.Query';
import * as _219 from './params/v1beta1/query.rpc.Query';
import * as _220 from './staking/v1beta1/query.rpc.Query';
import * as _221 from './tx/v1beta1/service.rpc.Service';
import * as _222 from './upgrade/v1beta1/query.rpc.Query';
import * as _225 from './bank/v1beta1/tx.rpc.msg';
import * as _226 from './consensus/v1/tx.rpc.msg';
import * as _227 from './distribution/v1beta1/tx.rpc.msg';
import * as _228 from './feegrant/v1beta1/tx.rpc.msg';
import * as _229 from './gov/v1/tx.rpc.msg';
import * as _230 from './gov/v1beta1/tx.rpc.msg';
import * as _231 from './group/v1/tx.rpc.msg';
import * as _232 from './mint/v1beta1/tx.rpc.msg';
import * as _233 from './staking/v1beta1/tx.rpc.msg';
import * as _234 from './upgrade/v1beta1/tx.rpc.msg';
import * as _235 from './vesting/v1beta1/tx.rpc.msg';
import * as _245 from './rpc.query';
import * as _246 from './rpc.tx';
export namespace cosmos {
  export namespace app {
    export namespace runtime {
      export const v1alpha1 = {
        ..._12,
      };
    }
  }
  export namespace auth {
    export namespace module {
      export const v1 = {
        ..._13,
      };
    }
    export const v1beta1 = {
      ..._14,
      ..._15,
      ..._16,
      ..._17,
      ..._168,
      ..._180,
      ..._192,
      ..._207,
      ..._223,
    };
  }
  export namespace authz {
    export namespace module {
      export const v1 = {
        ..._18,
      };
    }
    export const v1beta1 = {
      ..._19,
      ..._20,
      ..._21,
      ..._22,
      ..._23,
      ..._193,
      ..._208,
      ..._224,
    };
  }
  export namespace bank {
    export namespace module {
      export const v1 = {
        ..._24,
      };
    }
    export const v1beta1 = {
      ..._25,
      ..._26,
      ..._27,
      ..._28,
      ..._29,
      ..._169,
      ..._181,
      ..._194,
      ..._209,
      ..._225,
    };
  }
  export namespace base {
    export namespace abci {
      export const v1beta1 = {
        ..._30,
      };
    }
    export namespace node {
      export const v1beta1 = {
        ..._31,
        ..._195,
        ..._210,
      };
    }
    export namespace query {
      export const v1beta1 = {
        ..._32,
      };
    }
    export namespace reflection {
      export const v2alpha1 = {
        ..._33,
      };
    }
    export const v1beta1 = {
      ..._34,
    };
  }
  export namespace capability {
    export namespace module {
      export const v1 = {
        ..._35,
      };
    }
  }
  export namespace consensus {
    export namespace module {
      export const v1 = {
        ..._36,
      };
    }
    export const v1 = {
      ..._37,
      ..._38,
      ..._170,
      ..._182,
      ..._196,
      ..._211,
      ..._226,
    };
  }
  export namespace crisis {
    export namespace module {
      export const v1 = {
        ..._39,
      };
    }
  }
  export namespace crypto {
    export const ed25519 = {
      ..._40,
    };
    export namespace hd {
      export const v1 = {
        ..._41,
      };
    }
    export namespace keyring {
      export const v1 = {
        ..._42,
      };
    }
    export const multisig = {
      ..._43,
    };
    export const secp256k1 = {
      ..._44,
    };
    export const secp256r1 = {
      ..._45,
    };
  }
  export namespace distribution {
    export namespace module {
      export const v1 = {
        ..._46,
      };
    }
    export const v1beta1 = {
      ..._47,
      ..._48,
      ..._49,
      ..._50,
      ..._171,
      ..._183,
      ..._197,
      ..._212,
      ..._227,
    };
  }
  export namespace evidence {
    export namespace module {
      export const v1 = {
        ..._51,
      };
    }
  }
  export namespace feegrant {
    export namespace module {
      export const v1 = {
        ..._52,
      };
    }
    export const v1beta1 = {
      ..._53,
      ..._54,
      ..._55,
      ..._56,
      ..._172,
      ..._184,
      ..._198,
      ..._213,
      ..._228,
    };
  }
  export namespace genutil {
    export namespace module {
      export const v1 = {
        ..._57,
      };
    }
  }
  export namespace gov {
    export namespace module {
      export const v1 = {
        ..._58,
      };
    }
    export const v1 = {
      ..._59,
      ..._60,
      ..._61,
      ..._62,
      ..._173,
      ..._185,
      ..._199,
      ..._214,
      ..._229,
    };
    export const v1beta1 = {
      ..._63,
      ..._64,
      ..._65,
      ..._66,
      ..._174,
      ..._186,
      ..._200,
      ..._215,
      ..._230,
    };
  }
  export namespace group {
    export namespace module {
      export const v1 = {
        ..._67,
      };
    }
    export const v1 = {
      ..._68,
      ..._69,
      ..._70,
      ..._71,
      ..._72,
      ..._175,
      ..._187,
      ..._201,
      ..._216,
      ..._231,
    };
  }
  export namespace mint {
    export namespace module {
      export const v1 = {
        ..._73,
      };
    }
    export const v1beta1 = {
      ..._74,
      ..._75,
      ..._76,
      ..._77,
      ..._176,
      ..._188,
      ..._202,
      ..._217,
      ..._232,
    };
  }
  export namespace nft {
    export namespace module {
      export const v1 = {
        ..._78,
      };
    }
  }
  export namespace orm {
    export namespace module {
      export const v1alpha1 = {
        ..._79,
      };
    }
    export namespace query {
      export const v1alpha1 = {
        ..._80,
        ..._218,
      };
    }
  }
  export namespace params {
    export namespace module {
      export const v1 = {
        ..._81,
      };
    }
    export const v1beta1 = {
      ..._82,
      ..._83,
      ..._203,
      ..._219,
    };
  }
  export namespace query {
    export const v1 = {
      ..._84,
    };
  }
  export namespace reflection {
    export const v1 = {
      ..._85,
    };
  }
  export namespace slashing {
    export namespace module {
      export const v1 = {
        ..._86,
      };
    }
  }
  export namespace staking {
    export namespace module {
      export const v1 = {
        ..._87,
      };
    }
    export const v1beta1 = {
      ..._88,
      ..._89,
      ..._90,
      ..._91,
      ..._92,
      ..._177,
      ..._189,
      ..._204,
      ..._220,
      ..._233,
    };
  }
  export namespace tx {
    export namespace config {
      export const v1 = {
        ..._93,
      };
    }
    export namespace signing {
      export const v1beta1 = {
        ..._94,
      };
    }
    export const v1beta1 = {
      ..._95,
      ..._96,
      ..._205,
      ..._221,
    };
  }
  export namespace upgrade {
    export namespace module {
      export const v1 = {
        ..._97,
      };
    }
    export const v1beta1 = {
      ..._98,
      ..._99,
      ..._100,
      ..._178,
      ..._190,
      ..._206,
      ..._222,
      ..._234,
    };
  }
  export namespace vesting {
    export namespace module {
      export const v1 = {
        ..._101,
      };
    }
    export const v1beta1 = {
      ..._102,
      ..._103,
      ..._179,
      ..._191,
      ..._235,
    };
  }
  export const ClientFactory = {
    ..._245,
    ..._246,
  };
}
