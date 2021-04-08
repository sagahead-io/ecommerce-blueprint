import gql from 'graphql-tag'

export default gql`
  fragment Account on Account {
    id
    createdAt
  }
`
