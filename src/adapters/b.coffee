Path = require 'path'
{Adapter, TextMessage} = require 'hubot'
{Chat} = require '../chat'

class B extends Adapter
  constructor: (@robot) ->
    @chat = new Chat()

  run: ->
    @chat.loadMessages()
    @robot.router.post '/b/messages', (req, res) =>
      message = @chat.receiveMessageJson(req.body)
      @_receive message
      res.send 201
    @robot.router.get '/b/messages', (req, res) =>
      res.send @chat.getMessages()
    @emit 'connected'

  send: (envelope, strings...)->
    strings.forEach (text) =>
      json =
        user: envelope.user.name
        room: envelope.room
        text: text
      @chat.receiveMessageJson json

  _receive: (message) ->
    user = @robot.brain.userForId 1, name: message.user, room: message.room
    @receive new TextMessage(user, message.text, message.id)

exports.use = (robot) ->
  new B robot
