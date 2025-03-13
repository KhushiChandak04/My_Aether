"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolAction = exports.ProtocolType = void 0;
var ProtocolType;
(function (ProtocolType) {
    ProtocolType["DEX"] = "DEX";
    ProtocolType["LENDING"] = "LENDING";
    ProtocolType["YIELD"] = "YIELD";
})(ProtocolType || (exports.ProtocolType = ProtocolType = {}));
var ProtocolAction;
(function (ProtocolAction) {
    ProtocolAction["SWAP"] = "SWAP";
    ProtocolAction["ADD_LIQUIDITY"] = "ADD_LIQUIDITY";
    ProtocolAction["REMOVE_LIQUIDITY"] = "REMOVE_LIQUIDITY";
    ProtocolAction["SUPPLY"] = "SUPPLY";
    ProtocolAction["BORROW"] = "BORROW";
    ProtocolAction["REPAY"] = "REPAY";
    ProtocolAction["STAKE"] = "STAKE";
    ProtocolAction["UNSTAKE"] = "UNSTAKE";
})(ProtocolAction || (exports.ProtocolAction = ProtocolAction = {}));
