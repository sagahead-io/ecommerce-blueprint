import gql from 'graphql-tag'

export default gql`
  query Me {
    me {
      isAuthorized
      id
    }
  }
`
