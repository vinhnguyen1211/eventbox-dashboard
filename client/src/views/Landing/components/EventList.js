
import React, { Component } from 'react'
import { client } from '@client'
import { event } from '@gqlQueries'
import { Col, Card } from 'antd'
import { withRouter } from 'react-router-dom'
import * as routes from '@routes'

@withRouter
class EventList extends Component{

  state = {
    events: []
  }

  componentDidMount = async () => {
    const { data: { events } } = await client.query({
      query: event.GET_PAGINATED_EVENTS_WITH_USERS, 
      variables: {status: 'draft', limit: 10}
    })
    this.setState({ events: events.edges })
  }

  handleGoToEventDetail = id => {
    this.props.history.push(`${routes.EVENT}/${id}`)
  }
  

  render(){
    const { events } = this.state
    return(
      <Card>
        {events && events.map((item, index) => (
          <Col
            key={index.toString()} className='block'
            md={6} xs={24}
            onClick={() => this.handleGoToEventDetail(item.id)}
          >
            <div className='content5-block-content'>
              <span>
                <img src={item.images.thumbnail} height='100%' alt='img' />
              </span>
              <p>{item.title}</p>
            </div>
          </Col>
        ))
        }
      </Card>
    )
  }
}

export default EventList