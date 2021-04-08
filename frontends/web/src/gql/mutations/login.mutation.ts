import gql from 'graphql-tag'

export default gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      loggedIn
    }
  }
`
