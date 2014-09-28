Fs = require 'fs'
Path = require 'path'
moment = require 'moment'
mkdirp = require 'mkdirp'
{Message} = require './message'

class Chat
  constructor: ->
    @dir = Path.resolve(process.env.HOME, '.hubot-b')
    @messages = []

  getMessages: ->
    @messages

  receiveMessageJson: (json) ->
    message = new Message(
      id: @_getMessageId()
      user: 'user'
      room: 'room'
      text: json.text
    )
    @_saveMessage message
    @messages.push message
    message

  loadMessages: ->
    start = moment.utc().subtract 2
    files = [0...2].reduce (files, i) =>
      d = moment.utc(start).add i, 'days'
      dir = Path.resolve @dir, d.format('YYYY/MM/DD')
      return files unless Fs.existsSync(dir)
      files.concat Fs.readdirSync(dir).map (file) -> Path.join dir, file
    , []
    @messages = files.map (file) ->
      data = Fs.readFileSync file, encoding: 'utf-8'
      JSON.parse data

  _load: ->
    if Fs.existsSync @dir
      data = Fs.readFileSync 'hubot-b.json', encoding: 'utf-8'
      @messages = JSON.parse data
    else
      @messages = []

  # messages/yyyy/mm/dd/unixtime.json
  _saveMessage: (message) ->
    file = @_getFileName message
    dir = Path.dirname file
    mkdirp.sync(dir) unless Fs.existsSync dir
    data = JSON.stringify message
    Fs.writeFileSync file, data, encoding: 'utf-8'

  _getFileName: (message) ->
    dir = Path.resolve @dir, 'messages'
    ts = moment.utc message.id
    Path.resolve @dir, ts.format('YYYY/MM/DD') + '/' + ts.valueOf() + '.json'

  _getMessageId: ->
    moment.utc().valueOf()

module.exports.Chat = Chat
