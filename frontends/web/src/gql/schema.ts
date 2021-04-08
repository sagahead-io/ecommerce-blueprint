import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
  _Any: any
  _FieldSet: any
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

export type Mutation = {
  __typename?: 'Mutation'
  addNotification: Scalars['Boolean']
  addEvent: Scalars['Boolean']
  login: LoginResponse
  loginChallenge: LoginChallengeResponse
}

export type MutationAddNotificationArgs = {
  message?: Maybe<Scalars['String']>
}

export type MutationAddEventArgs = {
  message?: Maybe<Scalars['String']>
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type Notification = {
  __typename?: 'Notification'
  id: Scalars['ID']
  message?: Maybe<Scalars['String']>
  date: Scalars['DateTime']
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

export type AccountFragment = { __typename?: 'Account' } & Pick<Account, 'id' | 'createdAt'>

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'LoginResponse' } & Pick<LoginResponse, 'loggedIn'>
}

export type CurrentDateQueryVariables = Exact<{ [key: string]: never }>

export type CurrentDateQuery = { __typename?: 'Query' } & Pick<Query, 'currentDate'>

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = { __typename?: 'Query' } & {
  me?: Maybe<{ __typename?: 'AuthAccountInfo' } & Pick<AuthAccountInfo, 'isAuthorized' | 'id'>>
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

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

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
  Account: ResolverTypeWrapper<Account>
  ID: ResolverTypeWrapper<Scalars['ID']>
  String: ResolverTypeWrapper<Scalars['String']>
  AuthAccountInfo: ResolverTypeWrapper<AuthAccountInfo>
  Float: ResolverTypeWrapper<Scalars['Float']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  Hello: ResolverTypeWrapper<Hello>
  LoginChallengeResponse: ResolverTypeWrapper<LoginChallengeResponse>
  LoginInput: LoginInput
  LoginResponse: ResolverTypeWrapper<LoginResponse>
  Mutation: ResolverTypeWrapper<{}>
  Notification: ResolverTypeWrapper<Notification>
  Query: ResolverTypeWrapper<{}>
  Subscription: ResolverTypeWrapper<{}>
  _Any: ResolverTypeWrapper<Scalars['_Any']>
  _FieldSet: ResolverTypeWrapper<Scalars['_FieldSet']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account
  ID: Scalars['ID']
  String: Scalars['String']
  AuthAccountInfo: AuthAccountInfo
  Float: Scalars['Float']
  Boolean: Scalars['Boolean']
  DateTime: Scalars['DateTime']
  Hello: Hello
  LoginChallengeResponse: LoginChallengeResponse
  LoginInput: LoginInput
  LoginResponse: LoginResponse
  Mutation: {}
  Notification: Notification
  Query: {}
  Subscription: {}
  _Any: Scalars['_Any']
  _FieldSet: Scalars['_FieldSet']
}

export type ExtendsDirectiveArgs = {}

export type ExtendsDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ExtendsDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type ExternalDirectiveArgs = {}

export type ExternalDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ExternalDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type KeyDirectiveArgs = { fields: Scalars['_FieldSet'] }

export type KeyDirectiveResolver<Result, Parent, ContextType = any, Args = KeyDirectiveArgs> = DirectiveResolverFn<
  Result,
  Parent,
  ContextType,
  Args
>

export type ProvidesDirectiveArgs = { fields: Scalars['_FieldSet'] }

export type ProvidesDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ProvidesDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type RequiresDirectiveArgs = { fields: Scalars['_FieldSet'] }

export type RequiresDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = RequiresDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type AccountResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  auth0Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  auth0Roles?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AuthAccountInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthAccountInfo'] = ResolversParentTypes['AuthAccountInfo']
> = {
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  auth0Id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  isAuthorized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LoginChallengeResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginChallengeResponse'] = ResolversParentTypes['LoginChallengeResponse']
> = {
  verifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  challenge?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']
> = {
  loggedIn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  addNotification?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationAddNotificationArgs, never>
  >
  addEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddEventArgs, never>>
  login?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>
  loginChallenge?: Resolver<ResolversTypes['LoginChallengeResponse'], ParentType, ContextType>
}

export type NotificationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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

export interface _AnyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['_Any'], any> {
  name: '_Any'
}

export interface _FieldSetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['_FieldSet'], any> {
  name: '_FieldSet'
}

export type Resolvers<ContextType = any> = {
  Account?: AccountResolvers<ContextType>
  AuthAccountInfo?: AuthAccountInfoResolvers<ContextType>
  DateTime?: GraphQLScalarType
  Hello?: HelloResolvers<ContextType>
  LoginChallengeResponse?: LoginChallengeResponseResolvers<ContextType>
  LoginResponse?: LoginResponseResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Notification?: NotificationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  _Any?: GraphQLScalarType
  _FieldSet?: GraphQLScalarType
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
export type DirectiveResolvers<ContextType = any> = {
  extends?: ExtendsDirectiveResolver<any, any, ContextType>
  external?: ExternalDirectiveResolver<any, any, ContextType>
  key?: KeyDirectiveResolver<any, any, ContextType>
  provides?: ProvidesDirectiveResolver<any, any, ContextType>
  requires?: RequiresDirectiveResolver<any, any, ContextType>
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
export const AccountFragmentDoc = gql`
  fragment Account on Account {
    id
    createdAt
  }
`
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      loggedIn
    }
  }
`
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options)
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>
export const CurrentDateDocument = gql`
  query CurrentDate {
    currentDate
  }
`

/**
 * __useCurrentDateQuery__
 *
 * To run a query within a React component, call `useCurrentDateQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentDateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentDateQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentDateQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentDateQuery, CurrentDateQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CurrentDateQuery, CurrentDateQueryVariables>(CurrentDateDocument, options)
}
export function useCurrentDateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CurrentDateQuery, CurrentDateQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CurrentDateQuery, CurrentDateQueryVariables>(CurrentDateDocument, options)
}
export type CurrentDateQueryHookResult = ReturnType<typeof useCurrentDateQuery>
export type CurrentDateLazyQueryHookResult = ReturnType<typeof useCurrentDateLazyQuery>
export type CurrentDateQueryResult = Apollo.QueryResult<CurrentDateQuery, CurrentDateQueryVariables>
export const MeDocument = gql`
  query Me {
    me {
      isAuthorized
      id
    }
  }
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
