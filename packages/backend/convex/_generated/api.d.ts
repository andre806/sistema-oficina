/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as assinatura from "../assinatura.js";
import type * as cliente from "../cliente.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_types from "../lib/types.js";
import type * as oficina from "../oficina.js";
import type * as permissions from "../permissions.js";
import type * as servicos from "../servicos.js";
import type * as users from "../users.js";
import type * as veiculo from "../veiculo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assinatura: typeof assinatura;
  cliente: typeof cliente;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/types": typeof lib_types;
  oficina: typeof oficina;
  permissions: typeof permissions;
  servicos: typeof servicos;
  users: typeof users;
  veiculo: typeof veiculo;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
