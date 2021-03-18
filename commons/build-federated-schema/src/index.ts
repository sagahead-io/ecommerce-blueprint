import { printSchema } from '@apollo/federation'
import { buildSchema, createResolversMap, BuildSchemaOptions } from 'type-graphql'
import {
  specifiedDirectives,
  GraphQLFieldResolver,
  GraphQLScalarType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLDirective,
  DirectiveLocation,
} from 'graphql'

export const KeyDirective = new GraphQLDirective({
  name: 'key',
  locations: [DirectiveLocation.OBJECT, DirectiveLocation.INTERFACE],
  args: {
    fields: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
})

export const ExtendsDirective = new GraphQLDirective({
  name: 'extends',
  locations: [DirectiveLocation.OBJECT, DirectiveLocation.INTERFACE],
})

export const ExternalDirective = new GraphQLDirective({
  name: 'external',
  locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
})

export const RequiresDirective = new GraphQLDirective({
  name: 'requires',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    fields: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
})

export const ProvidesDirective = new GraphQLDirective({
  name: 'provides',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    fields: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
})

const federationDirectives = [KeyDirective, ExtendsDirective, ExternalDirective, RequiresDirective, ProvidesDirective]

export interface SchemaOptions {
  schema: string
  resolvers: GraphQLResolverMap
}

export interface GraphQLResolverMap<TContext = {}> {
  [typeName: string]:
    | {
        [fieldName: string]:
          | GraphQLFieldResolver<any, TContext>
          | { requires?: string; resolve: GraphQLFieldResolver<any, TContext> }
      }
    | GraphQLScalarType
    | { [enumValue: string]: string | number }
}

export default async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
): Promise<SchemaOptions> {
  const schema = await buildSchema({
    ...options,
    skipCheck: true,
    directives: [...specifiedDirectives, ...federationDirectives, ...(options.directives || [])],
  })

  const modifiedSchema = printSchema(schema)
    .replace('type Query {', 'type Query @extends {')
    .replace('type Mutation {', 'type Mutation @extends {')
    .replace('type Subscription {', 'type Subscription @extends {')

  return {
    schema: modifiedSchema,
    resolvers: createResolversMap(schema) as GraphQLResolverMap,
  }
}
