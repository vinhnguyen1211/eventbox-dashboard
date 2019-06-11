import { gql } from 'apollo-server-express'

export default gql`
  type EventLog {
    id: ID!
    userId: ID
    userInfo: User
    userEmail: String
    action: String
    subjectText: String
    eventId: ID
    eventInfo: Event
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    eventLogs(eventId: ID!): [EventLog]
  }

  extend type Mutation {
    writeLog(eventId: ID!, action: String, subjectText: String): EventLog
  }
`
