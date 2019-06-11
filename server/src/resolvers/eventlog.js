import { combineResolvers } from 'graphql-resolvers'
import { isAdmin, isEventOwner } from './authorization'

export default {
  Query: {
    eventLogs: combineResolvers(isEventOwner, async (parent, { eventId }, { models }) => {
      return await models.EventLog.find({ eventId }, null, {
        sort: {
          createdAt: -1
        }
      })
    })
  },

  Mutation: {
    writeLog: combineResolvers(async (parent, { eventId, action, subjectText }, { models, me }) => {
      const log = new models.EventLog({
        userId: me.id,
        userEmail: me.email,
        eventId,
        action,
        subjectText
      })
      return await log.save()
    })
  },

  EventLog: {
    userInfo: async (log, args, { loaders }) => await loaders.user.load(log.userId),
    eventInfo: async ({ eventId }, args, { models, loaders }) => {
      return await models.Event.findById(eventId)
    }
  }
}
