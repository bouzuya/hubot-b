
var Message;

Message = (function() {
  function Message(_arg) {
    var id, room, text, user;
    id = _arg.id, user = _arg.user, room = _arg.room, text = _arg.text;
    this.id = id;
    this.user = user;
    this.room = room;
    this.text = text;
  }

  return Message;

})();

module.exports.Message = Message;
