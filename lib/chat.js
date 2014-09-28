
var Chat, Fs, Message, Path, mkdirp, moment;

Fs = require('fs');

Path = require('path');

moment = require('moment');

mkdirp = require('mkdirp');

Message = require('./message').Message;

Chat = (function() {
  function Chat() {
    this.dir = Path.resolve(process.env.HOME, '.hubot-b');
    this.messages = [];
  }

  Chat.prototype.getMessages = function() {
    return this.messages;
  };

  Chat.prototype.receiveMessageJson = function(json) {
    var message;
    message = new Message({
      id: this._getMessageId(),
      user: 'user',
      room: 'room',
      text: json.text
    });
    this._saveMessage(message);
    this.messages.push(message);
    return message;
  };

  Chat.prototype.loadMessages = function() {
    var files, start;
    start = moment.utc().subtract(2);
    files = [0, 1].reduce((function(_this) {
      return function(files, i) {
        var d, dir;
        d = moment.utc(start).add(i, 'days');
        dir = Path.resolve(_this.dir, d.format('YYYY/MM/DD'));
        if (!Fs.existsSync(dir)) {
          return files;
        }
        return files.concat(Fs.readdirSync(dir).map(function(file) {
          return Path.join(dir, file);
        }));
      };
    })(this), []);
    return this.messages = files.map(function(file) {
      var data;
      data = Fs.readFileSync(file, {
        encoding: 'utf-8'
      });
      return JSON.parse(data);
    });
  };

  Chat.prototype._load = function() {
    var data;
    if (Fs.existsSync(this.dir)) {
      data = Fs.readFileSync('hubot-b.json', {
        encoding: 'utf-8'
      });
      return this.messages = JSON.parse(data);
    } else {
      return this.messages = [];
    }
  };

  Chat.prototype._saveMessage = function(message) {
    var data, dir, file;
    file = this._getFileName(message);
    dir = Path.dirname(file);
    if (!Fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
    data = JSON.stringify(message);
    return Fs.writeFileSync(file, data, {
      encoding: 'utf-8'
    });
  };

  Chat.prototype._getFileName = function(message) {
    var dir, ts;
    dir = Path.resolve(this.dir, 'messages');
    ts = moment.utc(message.id);
    return Path.resolve(this.dir, ts.format('YYYY/MM/DD') + '/' + ts.valueOf() + '.json');
  };

  Chat.prototype._getMessageId = function() {
    return moment.utc().valueOf();
  };

  return Chat;

})();

module.exports.Chat = Chat;
