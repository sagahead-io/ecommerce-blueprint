import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<import('mercurius-codegen').DeepPartial<TResult>> | import('mercurius-codegen').DeepPartial<TResult>
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  _Any: any
  _FieldSet: any
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: Date
}

export type Mutation = {
  __typename?: 'Mutation'
  addNotification: Scalars['Boolean']
  addEvent: Scalars['Boolean']
  login: LoginResponse
  loginChallenge: LoginChallengeResponse
}

export type MutationaddNotificationArgs = {
  message?: Maybe<Scalars['String']>
}

export type MutationaddEventArgs = {
  message?: Maybe<Scalars['String']>
}

export type MutationloginArgs = {
  input: LoginInput
}

export type Query = {
  __typename?: 'Query'
  hiFromAuth?: Maybe<Hello>
  testas?: Maybe<Hello>
  currentDate: Scalars['DateTime']
  me?: Maybe<AuthAccountInfo>
}

export type Subscription = {
  __typename?: 'Subscription'
  subscribeNotifications: Notification
  subscribeNotifications2: Notification
  subscribeEvents: Notification
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  auth0Id: Scalars['String']
  auth0Roles?: Maybe<Array<Scalars['String']>>
}

export type AuthAccountInfo = {
  __typename?: 'AuthAccountInfo'
  id: Scalars['Float']
  auth0Id: Scalars['String']
  roles: Array<Scalars['String']>
  isAuthorized: Scalars['Boolean']
}

export type Hello = {
  __typename?: 'Hello'
  id: Scalars['ID']
  text: Scalars['String']
}

export type LoginChallengeResponse = {
  __typename?: 'LoginChallengeResponse'
  verifier: Scalars['String']
  challenge: Scalars['String']
}

export type LoginInput = {
  accessToken?: Maybe<Scalars['String']>
}

export type LoginResponse = {
  __typename?: 'LoginResponse'
  loggedIn: Scalars['Boolean']
}

export type Notification = {
  __typename?: 'Notification'
  id: Scalars['ID']
  message?: Maybe<Scalars['String']>
  date: Scalars['DateTime']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  _Any: ResolverTypeWrapper<Scalars['_Any']>
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  String: ResolverTypeWrapper<Scalars['String']>
  Query: ResolverTypeWrapper<{}>
  Subscription: ResolverTypeWrapper<{}>
  Account: ResolverTypeWrapper<Account>
  ID: ResolverTypeWrapper<Scalars['ID']>
  AuthAccountInfo: ResolverTypeWrapper<AuthAccountInfo>
  Float: ResolverTypeWrapper<Scalars['Float']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  Hello: ResolverTypeWrapper<Hello>
  LoginChallengeResponse: ResolverTypeWrapper<LoginChallengeResponse>
  LoginInput: LoginInput
  LoginResponse: ResolverTypeWrapper<LoginResponse>
  Notification: ResolverTypeWrapper<Notification>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  _Any: Scalars['_Any']
  Mutation: {}
  Boolean: Scalars['Boolean']
  String: Scalars['String']
  Query: {}
  Subscription: {}
  Account: Account
  ID: Scalars['ID']
  AuthAccountInfo: AuthAccountInfo
  Float: Scalars['Float']
  DateTime: Scalars['DateTime']
  Hello: Hello
  LoginChallengeResponse: LoginChallengeResponse
  LoginInput: LoginInput
  LoginResponse: LoginResponse
  Notification: Notification
}

export interface _AnyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['_Any'], any> {
  name: '_Any'
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  addNotification?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationaddNotificationArgs, never>
  >
  addEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationaddEventArgs, never>>
  login?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationloginArgs, 'input'>>
  loginChallenge?: Resolver<ResolversTypes['LoginChallengeResponse'], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  hiFromAuth?: Resolver<Maybe<ResolversTypes['Hello']>, ParentType, ContextType>
  testas?: Resolver<Maybe<ResolversTypes['Hello']>, ParentType, ContextType>
  currentDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['AuthAccountInfo']>, ParentType, ContextType>
}

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  subscribeNotifications?: SubscriptionResolver<
    ResolversTypes['Notification'],
    'subscribeNotifications',
    ParentType,
    ContextType
  >
  subscribeNotifications2?: SubscriptionResolver<
    ResolversTypes['Notification'],
    'subscribeNotifications2',
    ParentType,
    ContextType
  >
  subscribeEvents?: SubscriptionResolver<ResolversTypes['Notification'], 'subscribeEvents', ParentType, ContextType>
}

export type AccountResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  auth0Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  auth0Roles?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AuthAccountInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthAccountInfo'] = ResolversParentTypes['AuthAccountInfo']
> = {
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  auth0Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  isAuthorized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type HelloResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Hello'] = ResolversParentTypes['Hello']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LoginChallengeResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginChallengeResponse'] = ResolversParentTypes['LoginChallengeResponse']
> = {
  verifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  challenge?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']
> = {
  loggedIn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type NotificationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type extendsDirectiveArgs = {}

export type extendsDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = extendsDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type Resolvers<ContextType = any> = {
  _Any?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  Account?: AccountResolvers<ContextType>
  AuthAccountInfo?: AuthAccountInfoResolvers<ContextType>
  DateTime?: GraphQLScalarType
  Hello?: HelloResolvers<ContextType>
  LoginChallengeResponse?: LoginChallengeResponseResolvers<ContextType>
  LoginResponse?: LoginResponseResolvers<ContextType>
  Notification?: NotificationResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
export type DirectiveResolvers<ContextType = any> = {
  extends?: extendsDirectiveResolver<any, any, ContextType>
}

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>

type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj
    params: TParams
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply
  },
) => Promise<Array<import('mercurius-codegen').DeepPartial<TReturn>>>
type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>
      opts?: {
        cache?: boolean
      }
    }
export interface Loaders<TContext = import('mercurius').MercuriusContext & { reply: import('fastify').FastifyReply }> {
  Account?: {
    id?: LoaderResolver<Scalars['ID'], Account, {}, TContext>
    createdAt?: LoaderResolver<Scalars['DateTime'], Account, {}, TContext>
    updatedAt?: LoaderResolver<Scalars['DateTime'], Account, {}, TContext>
    auth0Id?: LoaderResolver<Scalars['String'], Account, {}, TContext>
    auth0Roles?: LoaderResolver<Maybe<Array<Scalars['String']>>, Account, {}, TContext>
  }

  AuthAccountInfo?: {
    id?: LoaderResolver<Scalars['Float'], AuthAccountInfo, {}, TContext>
    auth0Id?: LoaderResolver<Scalars['String'], AuthAccountInfo, {}, TContext>
    roles?: LoaderResolver<Array<Scalars['String']>, AuthAccountInfo, {}, TContext>
    isAuthorized?: LoaderResolver<Scalars['Boolean'], AuthAccountInfo, {}, TContext>
  }

  Hello?: {
    id?: LoaderResolver<Scalars['ID'], Hello, {}, TContext>
    text?: LoaderResolver<Scalars['String'], Hello, {}, TContext>
  }

  LoginChallengeResponse?: {
    verifier?: LoaderResolver<Scalars['String'], LoginChallengeResponse, {}, TContext>
    challenge?: LoaderResolver<Scalars['String'], LoginChallengeResponse, {}, TContext>
  }

  LoginResponse?: {
    loggedIn?: LoaderResolver<Scalars['Boolean'], LoginResponse, {}, TContext>
  }

  Notification?: {
    id?: LoaderResolver<Scalars['ID'], Notification, {}, TContext>
    message?: LoaderResolver<Maybe<Scalars['String']>, Notification, {}, TContext>
    date?: LoaderResolver<Scalars['DateTime'], Notification, {}, TContext>
  }
}
declare module 'mercurius' {
  interface IResolvers extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
