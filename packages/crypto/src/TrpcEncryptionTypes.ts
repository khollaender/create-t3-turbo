// trpc-helper.ts
import type { AppRouter } from '@hamr/backend/app/router';
import type {
  inferProcedureOutput,
  inferProcedureInput,
  //   inferSubscriptionOutput,
} from '@trpc/server';

import { ConvertToDecryptType } from '@hamr/business-logic/encryption';
/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter['_def']['queries'];
/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof AppRouter['_def']['mutations'];
/**
 * Enum containing all api subscription paths
 */
// type TSubscription = keyof AppRouter['_def']['subscriptions'];
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferDecryptedQueryOutput<TRouteKey extends TQuery> =
  ConvertToDecryptType<
    inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>
  >;

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>;
/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferDecryptedQueryInput<TRouteKey extends TQuery> =
  ConvertToDecryptType<
    inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>
  >;
/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferDecryptedMutationOutput<TRouteKey extends TMutation> =
  ConvertToDecryptType<
    inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>
  >;
/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferDecryptedMutationInput<TRouteKey extends TMutation> =
  ConvertToDecryptType<
    inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
  >;

// /**
//  * This is a helper method to infer the output of a subscription resolver
//  * @example type HelloOutput = InferSubscriptionOutput<'hello'>
//  */
// export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
//   inferProcedureOutput<AppRouter['_def']['subscriptions'][TRouteKey]>;
// /**
//  * This is a helper method to infer the asynchronous output of a subscription resolver
//  * @example type HelloAsyncOutput = InferAsyncSubscriptionOutput<'hello'>
//  */
// export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> =
//   inferSubscriptionOutput<AppRouter, TRouteKey>;
// /**
//  * This is a helper method to infer the input of a subscription resolver
//  * @example type HelloInput = InferSubscriptionInput<'hello'>
//  */
// export type InferSubscriptionInput<TRouteKey extends TSubscription> =
//   inferProcedureInput<AppRouter['_def']['subscriptions'][TRouteKey]>;
