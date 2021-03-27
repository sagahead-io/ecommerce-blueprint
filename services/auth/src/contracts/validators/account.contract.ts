import { IsArray, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class AccountValidator {
  @Field()
  @IsString()
  public auth0Id!: string

  @Field(() => [String], { nullable: true })
  @IsArray()
  public auth0Roles?: string[]
}
