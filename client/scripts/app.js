
var app = {

  init: function () {
    $('#send').on('submit', app.handleSubmit);
    app.currentUserName = window.location.search.split('=')[1];
    console.log(app.currentUserName);
  },

  currentRoomName: 'Default Room',

  currentUserName: null,

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
    var fetchedData = $.get('http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt');
    console.log(fetchedData);
    // $.ajax({
    //   // This is the url you should use to communicate with the parse API server.
    //   url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    //   type: 'GET',
    //   data: data,
    //   contentType: 'application/json',
    //   success: function (data) {
    //     console.log('chatterbox: messages fetched');
    //   },
    //   error: function (data) {
    //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //     console.error('chatterbox: Failed to fetch messages', data);
    //   }
    // });
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
    app.currentRoomName = roomName;
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
    var newMessage = {
      username: app.currentUserName,
      text: text,
      roomname: app.currentRoomName
    };
    app.send(newMessage);
    // submit shoudl call refresh method
    console.log(newMessage);
  },
};

$(app.init);
