import React from 'react'
import { Query } from 'react-apollo'
import { event } from '@gqlQueries'
import { Card, Empty, List, Avatar } from 'antd'
import { withTranslation } from 'react-i18next'

const EventLogs = ({ t, eventId }) => (
  <Query query={event.GET_EVENT_LOGS} variables={{ eventId }}>
    {({ data, loading }) => {
      if (loading) {
        return <Card loading />
      }
      if (!data) {
        return <Empty />
      }
      const logs = data.eventLogs
      if (logs.length <= 0) {
        return <Empty />
      }
      const item = (props) => <ListItem {...props} t={t} />

      return <List itemLayout='horizontal' dataSource={logs} renderItem={item} />
    }}
  </Query>
)

export default withTranslation()(EventLogs)

const ListItem = ({ t, userInfo, userEmail = '', action, subjectText, updatedAt }) => {
  const photo = userInfo && userInfo.photo

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={photo} size='large' />}
        title={
          <div>
            <span style={{ color: '#404142', fontWeight: 'bold' }}>{userEmail}</span>
          </div>
        }
        description={
          <div>
            <span style={{ color: '#77797a' }}>
              {t(`ActionEventLog_${action}`)}:{' '}
              <span style={{ fontStyle: 'italic', color: '#404142' }}>{subjectText}</span>
            </span>
          </div>
        }
      />
      <div>{new Date(updatedAt).toLocaleString()}</div>
    </List.Item>
  )
}
