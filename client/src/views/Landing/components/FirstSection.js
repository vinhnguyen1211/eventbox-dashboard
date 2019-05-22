import React, { Component } from 'react'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, AutoComplete, Form, Button, Tabs, Icon, Select, Skeleton, message } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import * as routes from '@routes'
import { event } from '@gqlQueries'
import { Query } from 'react-apollo'
import { client } from '@client'
import moment from 'moment'

import { categoryOpts, selectTimeOpts } from '../../../constants/options'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

@withRouter
class FirstSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
      searchResult: []
    }
  }

  handleGoToEventDetail = (event) => {
    this.props.history.push(`${routes.EVENT}/${event.slug}-${event.id}`)
  }

  handleAutoCompleteSelect = (eventsForSearch, words) => {
    const selectedEvent = eventsForSearch.filter(
      (event) => event.title.toLowerCase().indexOf(words.toLowerCase()) !== -1
    )[0]
    this.props.history.push(`${routes.EVENT}/${selectedEvent.slug}-${selectedEvent.id}`)
  }

  handleAutoCompleteSearch = (eventsForSearch, words) => {
    if (words) {
      const events = eventsForSearch.map((event) => event.title)
      const suggestions = events.filter(
        (title) => title.toLowerCase().indexOf(words.toLowerCase()) !== -1
      )
      this.setState({ suggestions })
    } else this.setState({ suggestions: [] })
  }

  handleTab1Search = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const {
            data: { eventsByKeywords }
          } = await client.query({
            variables: { keywords: values.searchbar },
            query: event.EVENTS_BY_KEYWORDS,
            fetchPolicy: 'network-only'
          })
          if (!eventsByKeywords.length) message.warn('No event to show base on your keywords!')
          this.setState({ searchResult: eventsByKeywords })
        } catch (err) {
          message.error(err)
        }
      } else return message.error('An error occurred!')
    })
  }

  render() {
    const {
      state: { suggestions, searchResult },
      props: {
        i18n,
        form: { getFieldDecorator },
        history
      }
    } = this
    const formInputLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 }
      }
    }
    const formButtonLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 }
      }
    }

    const categoryOptions = []
    categoryOpts.map((opt) => {
      categoryOptions.push(<Option key={opt.key}>{i18n.t(opt.text)}</Option>)
      return opt
    })

    const selectTimeOptions = []
    selectTimeOpts.map((opt) => {
      selectTimeOptions.push(<Option key={opt.key}>{i18n.t(opt.text)}</Option>)
      return opt
    })

    return (
      <div className='home-page-wrapper content0-wrapper'>
        <div className='home-page content0'>
          <div className='title-wrapper'>
            <Tabs defaultActiveKey='1'>
              <TabPane
                tab={
                  <span>
                    <Icon type='form' />
                    {i18n.t('Search by keywords')}
                  </span>
                }
                key='1'
              >
                <Form
                  style={{
                    background: 'rgba(0,0,0,.03)',
                    borderRadius: 10,
                    padding: 10
                  }}
                >
                  <Query query={event.EVENTS_FOR_SEARCH} fetchPolicy='cache-first'>
                    {({ loading, error, data }) => {
                      if (loading) return <Skeleton />
                      if (error) return message.error(error)
                      if (data && data.eventsForSearch) {
                        const { eventsForSearch } = data
                        return (
                          <FormItem {...formInputLayout}>
                            {getFieldDecorator('searchbar', { rules: [] })(
                              <AutoComplete
                                id='searchbar'
                                dataSource={suggestions}
                                onSelect={(words) =>
                                  this.handleAutoCompleteSelect(eventsForSearch, words)
                                }
                                onSearch={(words) =>
                                  this.handleAutoCompleteSearch(eventsForSearch, words)
                                }
                                placeholder='Search for events...'
                                style={{ width: '60%' }}
                              />
                            )}
                          </FormItem>
                        )
                      } else {
                        return null
                      }
                    }}
                  </Query>
                  <FormItem {...formButtonLayout}>
                    <Button
                      style={{
                        background: 'rgba(13, 32, 51, .8)',
                        border: 'rgba(13, 32, 51, .8)'
                      }}
                      type='primary'
                      onClick={this.handleTab1Search}
                    >
                      {i18n.t('Search')}
                      <Icon type='search' />
                    </Button>
                  </FormItem>
                </Form>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type='bars' />
                    {i18n.t('Search by Options')}
                  </span>
                }
                key='2'
              >
                <Row gutter={20}>
                  <Col xs={0} sm={0} md={6} lg={6} />
                  <Col xs={24} sm={24} md={6} lg={6} style={{ margin: '10px 0' }}>
                    <Select
                      suffixIcon={<Icon type='calendar' />}
                      placeholder='Select categories'
                      mode='multiple'
                      style={{ width: '100%' }}
                      onSelect={(e) => {
                        console.log(e)
                      }}
                    >
                      {categoryOptions}
                    </Select>
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={6} style={{ margin: '10px 0' }}>
                    <Select
                      placeholder='Select time'
                      style={{ width: '100%' }}
                      onSelect={(e) => {
                        console.log(e)
                      }}
                    >
                      {selectTimeOptions}
                    </Select>
                  </Col>
                  <Col xs={0} sm={0} md={6} lg={6} />
                </Row>
              </TabPane>
            </Tabs>
          </div>
          <OverPack playScale={0.1} className='content-template'>
            <QueueAnim className='block-wrapper' type='bottom' key='block'>
              <Row key='ul' className='content5-img-wrapper' type='flex' gutter={24}>
                {searchResult &&
                  searchResult.map((item, index) => (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      key={index.toString()}
                      className='block'
                      onClick={() => history.push(`${routes.EVENT}/${item.slug}-${item.id}`)}
                    >
                      <div className='content5-block-content'>
                        <div className='coverEvent'>
                          <img src={item.images.thumbnail} alt='img' />
                        </div>
                        <div className='info'>
                          <div className='nameTitle'>
                            <span>
                              {item.title.length > 63
                                ? item.title.substring(0, 60).concat('...')
                                : item.title}
                            </span>
                          </div>
                          <div className='categoRies' />
                          <div style={{ paddingTop: 10 }}>
                            <div className='fake-calendar'>
                              <div className='month'>{moment(item.startTime).format('MMMM')}</div>
                              <div className='date'>{moment(item.startTime).format('DD')}</div>
                              <div className='weekDate'>
                                {moment(item.startTime).format('dddd')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
              </Row>
            </QueueAnim>
          </OverPack>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Form.create()(FirstSection))
