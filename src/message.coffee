class Message
  constructor: ({ id, user, room, text }) ->
    @id = id
    @user = user
    @room = room
    @text = text

module.exports.Message = Message
