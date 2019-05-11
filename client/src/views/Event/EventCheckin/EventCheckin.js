import React, { Component } from 'react'
import {
  List,
  Tooltip,
  notification,
  Row,
  Col,
  Card,
  Affix,
  Popconfirm,
  Button,
  message,
  Skeleton
} from 'antd'
import './styles.scss'
import { Query, Mutation } from 'react-apollo'
import { ticket } from '@gqlQueries'
import moment from 'moment'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'

const EventCheckinWrapper = (props) => {
  const { eventId } = props.match.params
  const { state } = props.location
  if (!state || !state.eventTitle) {
    return (
      <Query
        query={gql`event(id: ${eventId}){
            title
          }`}
        variables={{ eventId }}
      >
        {({ data, loading }) => (
          <div>
            <TitleWrapper event={data.event} />
            <EventCheckin {...props} />
            <Query query={ticket.TICKETS} variables={{ eventId }}>
              {({ data, loading, subscribeToMore }) => (
                <EventCheckin
                  eventId={eventId}
                  loading={loading}
                  tickets={data.tickets}
                  subscribeToMore={subscribeToMore}
                />
              )}
            </Query>
          </div>
        )}
      </Query>
    )
  } else {
    return (
      <div>
        <TitleWrapper event={{ title: state.eventTitle }} />
        <Query query={ticket.TICKETS} variables={{ eventId }}>
          {({ data, loading, subscribeToMore }) => (
            <EventCheckin
              eventId={eventId}
              loading={loading}
              tickets={data.tickets}
              subscribeToMore={subscribeToMore}
            />
          )}
        </Query>
      </div>
    )
  }
}

const TitleWrapper = ({ event }) => (
  <div style={{ padding: '10px' }}>
    <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
      {event && event.title}
    </h1>
  </div>
)

export default EventCheckinWrapper

@withTranslation()
class EventCheckin extends Component {
  state = {
    ticket: undefined
  }
  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }

  subscribeToMoreTicket = () => {
    const { eventId } = this.props
    this.props.subscribeToMore({
      document: ticket.SUBSCRIBE_TICKET_CHECKIN,
      variables: { eventId },
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult
        }

        const {
          eventCheckedIn: {
            userInfo: { email }
          }
        } = subscriptionData.data
        notification.success({
          message: 'News',
          description: (
            <div>
              <span style={{ fontWeight: 'bold' }}>{email}</span> has just checked-in
            </div>
          )
        })
      }
    })
  }

  componentDidMount = () => {
    this.subscribeToMoreTicket()
  }

  onSelectTicket = (id) => {
    const {
      state: { ticket: ticketSelected },
      props: { tickets }
    } = this
    if (ticketSelected && ticketSelected.id === id) {
      this.setState({ ticket: undefined })
    } else {
      const ticket = tickets.find((item) => item.id === id)
      ticket && this.setState({ ticket })
    }
  }

  renderItem(item, index) {
    const {
      onSelectTicket,
      state: { ticket: ticketSelected },
      props: { t, eventId }
    } = this

    return (
      <LisItem
        item={item}
        eventId={eventId}
        t={t}
        selected={(ticketSelected && ticketSelected.id === item.id) || false}
        index={index}
        onSelect={onSelectTicket}
      />
    )
  }

  render() {
    const {
      renderItem,
      state: { ticket: ticketSelected }
    } = this
    const { tickets, loading, t } = this.props
    const numberOfCheckedIn = tickets && tickets.filter((t) => t.checkedIn).length
    const total = tickets && tickets.length
    // console.log('numberOfCheckedIn: ', numberOfCheckedIn)
    // console.log('ticketSelected: ', ticketSelected)

    return (
      <Row>
        <Participants t={t} loading={loading} numberOfCheckedIn={numberOfCheckedIn} total={total} />
        <Col span={14}>
          <List
            size='large'
            loading={loading}
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            bordered
            dataSource={loading ? [] : tickets}
            className='event-checkin-list__wrapper'
            renderItem={renderItem}
          />
        </Col>
        <Col span={10} style={{ paddingLeft: 14 }}>
          <Affix offsetTop={30}>
            <TicketInfo ticket={ticketSelected || {}} />
          </Affix>
        </Col>
      </Row>
    )
  }
}

const Participants = React.memo(({ t, loading, numberOfCheckedIn, total }) => {
  // console.log('re-render patps')
  return loading ? (
    <Skeleton active paragraph={{ rows: 0 }} />
  ) : (
    <Col style={{ paddingBottom: 14 }}>
      {t('Number of users checked in')}:{' '}
      <span style={{ fontWeight: 'bold' }}>
        {numberOfCheckedIn || 0} / {total || 1}
      </span>
    </Col>
  )
})

const ticketQueries = ticket
const LisItem = React.memo((props) => {
  const { item, eventId, t, selected, index, ...rest } = props
  // console.log('re-render item: ')
  return (
    <List.Item
      className={`tag-custom-type-${item.checkedIn ? 'success' : 'error'} ${
        // item.id === (ticket && ticket.id) ? 'selected' : ''
        selected ? 'selected' : ''
      }`}
      actions={[
        item.checkedInTime ? (
          <Tooltip title={moment(item.checkedInTime).format('DD/MM/YYYY HH:mm:ss')}>
            {moment(item.checkedInTime).fromNow()}
          </Tooltip>
        ) : (
          'Ticket available'
        ),
        <Mutation
          mutation={ticketQueries.DELETE_TICKET}
          variables={{ eventId, ticketId: item.id }}
          update={(cache, { data: { deleteTicket } }) => {
            if (!deleteTicket) {
              return
            }
            try {
              const data = cache.readQuery({
                query: ticketQueries.TICKETS,
                variables: { eventId }
              })
              cache.writeQuery({
                query: ticketQueries.TICKETS,
                variables: { eventId },
                data: {
                  ...data,
                  tickets: data.tickets.filter((t) => t.id !== item.id)
                }
              })
            } catch (error) {
              // console.log('error: ', error)
            }
          }}
          onCompleted={() => {
            message.success('Remove ticket successfully!')
          }}
        >
          {(deleteTicket, { data, loading, error }) => (
            <Popconfirm
              placement='topRight'
              title={t('Are you sure to remove this ticket?')}
              onConfirm={deleteTicket}
              okText='Yes'
              cancelText='No'
            >
              <Button type='danger' loading={loading}>
                {t('Remove')}
              </Button>
            </Popconfirm>
          )}
        </Mutation>
      ]}
    >
      <ListItemMeta index={index} item={item} ticketId={item.id} onSelect={rest.onSelect} />
    </List.Item>
  )
})

const ListItemMeta = React.memo(({ index, item, ticketId, onSelect }) => {
  // console.log('re-render meta')
  return (
    <List.Item.Meta
      title={`${index + 1}. ${item.userInfo && item.userInfo.email}`}
      onClick={() => {
        onSelect && onSelect(ticketId)
      }}
    />
  )
})

const TicketInfo = withTranslation()(
  ({ t: trans, ticket }) =>
    Object.keys(ticket).length > 0 && (
      <Card>
        <div>
          <label style={{ color: '#616161' }}>{trans('Ticket Email')}: </label>
          <span style={{ color: '#424242' }}>{ticket.userInfo && ticket.userInfo.email}</span>
        </div>
        <div>
          <label style={{ color: '#616161' }}>{trans('Ticket username')}: </label>
          <span style={{ color: '#424242' }}>{ticket.userInfo && ticket.userInfo.username}</span>
        </div>
        <div>
          <label style={{ color: '#616161' }}>{trans('Ticket status')}: </label>
          <span
            style={{
              color: `${ticket.checkedIn ? '#757575' : '#388e3c'}`,
              fontStyle: `${ticket.checkedIn ? 'italic' : 'normal'}`
            }}
          >
            {' '}
            {/* eslint-disable */}
            {ticket.checkedIn
              ? `${trans('Ticket is used')} - ${moment(ticket.checkedInTime).format(
                  'DD/MM/YYYY HH:mm:ss'
                )}`
              : trans('Ticket is available')}
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <img
            src={ticket.ticketSvgSrc}
            style={{ backgroundColor: '#fff' }}
            width={280}
            alt='ticket_qrcode'
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ color: '#616161' }}>{trans('Ticket code')}: </label>
          <span style={{ color: '#424242' }}>{ticket.code}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ color: '#616161' }}>{trans('Ticket registered at')}: </label>
          <span style={{ color: '#424242' }}>
            {moment(ticket.createdAt).format('DD/MM/YYYY HH:mm:ss')}
          </span>
        </div>
      </Card>
    )
)
