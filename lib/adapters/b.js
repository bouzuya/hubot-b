
var Adapter, B, Chat, Path, TextMessage, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Path = require('path');

_ref = require('hubot'), Adapter = _ref.Adapter, TextMessage = _ref.TextMessage;

Chat = require('../chat').Chat;

B = (function(_super) {
  __extends(B, _super);

  function B(robot) {
    this.robot = robot;
    this.chat = new Chat();
  }

  B.prototype.run = function() {
    this.chat.loadMessages();
    this.robot.router.post('/b/messages', (function(_this) {
      return function(req, res) {
        var message;
        message = _this.chat.receiveMessageJson(req.body);
        _this._receive(message);
        return res.send(201);
      };
    })(this));
    this.robot.router.get('/b/messages', (function(_this) {
      return function(req, res) {
        return res.send(_this.chat.getMessages());
      };
    })(this));
    return this.emit('connected');
  };

  B.prototype.send = function() {
    var envelope, strings;
    envelope = arguments[0], strings = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return strings.forEach((function(_this) {
      return function(text) {
        var json;
        json = {
          user: envelope.user.name,
          room: envelope.room,
          text: text
        };
        return _this.chat.receiveMessageJson(json);
      };
    })(this));
  };

  B.prototype._receive = function(message) {
    var user;
    user = this.robot.brain.userForId(1, {
      name: message.user,
      room: message.room
    });
    return this.receive(new TextMessage(user, message.text, message.id));
  };

  return B;

})(Adapter);

exports.use = function(robot) {
  return new B(robot);
};
