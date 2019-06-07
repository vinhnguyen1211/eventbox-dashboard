import mongoose from 'mongoose'

const Schema = mongoose.Schema

let departmentSchema = new Schema(
  {
    // type: {
    //   type: String,
    //   enum: ['system', 'user', 'event']
    // },
    // id of the user behind the cause of this log
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    // email of the user behind the cause of this log
    userEmail: {
      type: String
    },
    // action text for localization
    action: {
      type: String
    },
    // subject of action
    subjectText: {
      type: String
    },
    // type of the subject for query Info
    // subjectType: {
    //   type: String,
    //   enum: ['user', 'event', 'ticket', 'department', 'departmentuser', 'category', 'contact']
    // },
    //
    // subjectId: {
    //   type: Schema.Types.ObjectId
    // }
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'event'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('eventlog', departmentSchema)
