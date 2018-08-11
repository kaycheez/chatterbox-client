
var app = {

  init: function () {
    $('#send').on('submit', app.handleSubmit);
  },

  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  clearMessages: function () {
    $('#chats').html('');
  },

  renderMessage: function (message) {
    text = message.text;
    username = message.username;
    roomname = message.roomname;
    $message = $(`<div>${text}<div class="username" onclick="app.handleUsernameClick()">${username}</div>${roomname}</div>`);
    $message.appendTo('#chats');
  },

  renderRoom: function (roomName) {
    $room = $(`<option value="${roomName}">${roomName}</option>`);
    $room.appendTo('#roomSelect');
  },

  handleRooms: function() {
    var roomName = $('#roomSelect option:selected').text();
    if (roomName === 'Add a room!') {
      var newRoom = prompt('GIMME NAME!');
      app.renderRoom(newRoom);
    }
  },

  handleUsernameClick: function () {
    console.log('click');
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var text = $('#text').val();
    console.log(text);
  },
};

$(app.init);
