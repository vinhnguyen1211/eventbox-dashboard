import React from 'react'
import { ApolloConsumer } from 'react-apollo'

// import * as routes from '@routes'
// import history from '../../constants/history'

const SignOutButton = () => (
  <ApolloConsumer>
    {(client) => (
      <button type='button' onClick={() => signOut(client)}>
        Sign Out
      </button>
    )}
  </ApolloConsumer>
)

const signOut = async (client) => {
  try {
    /* eslint-disable */
    const result = await fetch('/api/auth/logout', {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      },
      method: 'POST'
    }).then((res) => res.json())
    // console.log('result: ', result)
  } catch (error) {
    // console.log('error: ', error)
  }

  localStorage.setItem('token', '')
  await client.resetStore()
  // if (history.location.pathname !== routes.HOME) {
  //   history.push(routes.HOME)
  // }
}

export { signOut }

export default SignOutButton
