import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { event, session } from '@gqlQueries'
import { Button, Modal, notification, Form, Input, Card, Row } from 'antd'
import { withTranslation } from 'react-i18next'
import { RULE_NOT_EMPTY } from '@formRules'
import { useApolloClient } from 'react-apollo-hooks'

const FormItem = Form.Item

// handle logging state before request
const RegisterButton = ({ form, t, eventId }) => {
  const [visible, setVisible] = useState(false)
  const onClose = () => setVisible(false)
  const { getFieldDecorator, getFieldsValue, validateFields } = form
  const client = useApolloClient()
  const [emailRegistration, setEmail] = useState('')

  const openModal = async () => {
    const { data } = await client.query({
      query: session.GET_LOCAL_SESSION
    })
    if (data && data.me) {
      setVisible(true)
      setEmail(data.me.email)
    } else {
      showError({ message: t('You must log in to register a ticket') })
    }
  }

  return (
    <>
      <Button type='primary' icon='fire' onClick={openModal}>
        {t('registerEvent')}
      </Button>
      <Modal visible={visible} onCancel={onClose} footer={false} closable={false} destroyOnClose>
        <Card title={t('Ticket Information')}>
          <Form hideRequiredMark>
            <FormItem key='fullName' label={t('Fullname')} colon={false}>
              {getFieldDecorator('fullName', {
                rules: [RULE_NOT_EMPTY]
              })(<Input placeholder={t('John Doe')} />)}
            </FormItem>
            <FormItem key='studentId' label={t('Student ID')} colon={false}>
              {getFieldDecorator('studentId', {
                rules: [RULE_NOT_EMPTY]
              })(<Input placeholder={t('T151111')} />)}
            </FormItem>
            <FormItem>
              <Mutation
                mutation={event.JOIN_EVENT}
                variables={{ eventId, ...getFieldsValue() }}
                update={(cache, { data: { joinEvent } }) => {
                  if (!joinEvent) {
                    return alert('Failed to delete')
                  }
                  const { code, ticketSvgSrc: svgSource } = joinEvent
                  showTicket({ code, svgSource, emailRegistration, t, setVisible })
                }}
                onError={({ graphQLErrors: [{ message }] }) => {
                  showError({ message })
                }}
              >
                {(joinEvent, { data, loading, error }) => (
                  <Row type='flex' justify='center'>
                    <Button
                      type='primary'
                      icon='fire'
                      onClick={() => {
                        validateFields((err, values) => {
                          if (!err) {
                            joinEvent()
                          }
                        })
                      }}
                      loading={loading}
                    >
                      {t('registerEvent')}
                    </Button>
                  </Row>
                )}
              </Mutation>
            </FormItem>
          </Form>
        </Card>
      </Modal>
    </>
  )
}

export default Form.create()(withTranslation()(RegisterButton))

const showError = ({ title = 'Something wrong', message }) => {
  notification.error({
    message: title,
    description: message
  })
  // const modal = Modal.error({
  //   title,
  //   content: message,
  //   maskClosable: true
  // })
  // setTimeout(() => {
  //   modal.destroy()
  // }, 2000)
}

const showTicket = ({ code, svgSource, emailRegistration, t, setVisible }) => {
  setVisible(false)
  Modal.success({
    title: 'Registered successfully',
    style: {
      top: 50
    },
    content: (
      <div>
        <div>
          <img src={svgSource} alt='ticket-src' />
        </div>
        <div style={{ padding: '24px 0' }}>
          {t('Your ticket code')}: <span style={{ color: '#4db6ac' }}>{code}</span>
        </div>
        <div>
          <span style={{ color: '#FF334B' }} />
          {t('Your ticket has been sent to your mailbox address')}
          {'\u00A0'}
          <span style={{ color: '#64b5f6' }}>{emailRegistration}</span>
        </div>
      </div>
    )
  })
}
