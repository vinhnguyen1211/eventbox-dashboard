import gql from 'graphql-tag'

const GET_PAGINATED_EVENTS_WITH_USERS = gql`
  query($status: String, $cursor: String, $limit: Int) {
    events(status: $status, cursor: $cursor, limit: $limit) @connection(key: "EventConnection") {
      edges {
        id
        title
        slug
        status
        images {
          thumbnail
        }
        departments {
          id
        }
        createdAt
        startTime
        updatedAt
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const GET_EVENTS_HOMEPAGE = gql`
  query {
    eventsHome {
      id
      title
      slug
      status
      images {
        thumbnail
      }
      startTime
      user {
        id
        username
      }
    }
  }
`

const GET_EVENT_DETAIL = gql`
  query($eventId: ID!, $forUpdate: Boolean, $forHome: Boolean) {
    event(id: $eventId, forUpdate: $forUpdate, forHome: $forHome) {
      id
      title
      description
      departments {
        id
        name
      }
      shortDescription
      maxTickets
      registerEndAt
      categories {
        id
      }
      images {
        thumbnail
      }
      createdAt
      organizationName
      organizationLogo
      organizationDescription
      startTime
      endTime
      location
      address
      user {
        id
        username
        email
      }
      status
      participants
    }
  }
`

const GET_EVENTS_INREVIEW = gql`
  query($page: Int, $limit: Int) {
    eventsInReview(page: $page, limit: $limit) @connection(key: "EventReviewConnection") {
      edges {
        id
        title
        slug
        status
        images {
          thumbnail
        }
        updatedAt
        user {
          id
          username
        }
      }
      departmentIds
    }
  }
`

const COUNT_EVENT_BY_TYPE = gql`
  query {
    countEventByType {
      entertainment
      learning
      others
    }
  }
`

const EVENTS_FOR_SEARCH = gql`
  query {
    eventsForSearch {
      id
      title
      slug
    }
  }
`

const EVENTS_BY_KEYWORDS = gql`
  query($keywords: String!) {
    eventsByKeywords(keywords: $keywords) {
      id
      title
      slug
      status
      images {
        thumbnail
      }
      startTime
      user {
        id
        username
      }
    }
  }
`

const GET_EVENT_LOGS = gql`
  query($eventId: ID!) {
    eventLogs(eventId: $eventId) {
      userInfo {
        photo
      }
      userEmail
      action
      subjectText
      updatedAt
    }
  }
`

export {
  GET_PAGINATED_EVENTS_WITH_USERS,
  GET_EVENTS_HOMEPAGE,
  GET_EVENT_DETAIL,
  GET_EVENTS_INREVIEW,
  COUNT_EVENT_BY_TYPE,
  EVENTS_FOR_SEARCH,
  EVENTS_BY_KEYWORDS,
  GET_EVENT_LOGS
}
