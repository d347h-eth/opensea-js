import { ethers } from "ethers";
import { OpenSeaSDK } from "./sdk";

// HOTFIX: Monkey-patch ethers.FetchRequest prototype to disable internal retries and reduce timeout for GET requests only
const originalSend = ethers.FetchRequest.prototype.send;
ethers.FetchRequest.prototype.send = async function (
  this: ethers.FetchRequest,
) {
  if (this.method === "GET") {
    this.timeout = 5000; // 5 seconds
    this.retryFunc = async (_req, _resp, _attempt) => {
      // console.log(`[OpenSea-JS-Patch] Suppressing retry for GET ${_req.url} (status ${_resp.statusCode})`);
      return false;
    };
    // console.log(`[OpenSea-JS-Patch] Enforcing 5s timeout & no-retry for GET request to ${this.url}`);
  } else {
    // console.log(`[OpenSea-JS-Patch] Using default configuration for ${this.method} request to ${this.url}`);
  }
  return await originalSend.call(this);
};

/**
 * @example
 * // Example Setup
 * ```ts
 * import { ethers } from 'ethers'
 * import { OpenSeaSDK, Chain } from 'opensea-js'
 * const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io')
 * const client = new OpenSeaSDK(provider, {
 *   chain: Chain.Mainnet
 * })
 * ```
 */
export {
  // Main SDK export
  OpenSeaSDK,
};

export * from "./types";
export * from "./api/types";
export * from "./orders/types";
export * from "./utils";
