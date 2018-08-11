
var app = {

  init: function () {
    $('#send').on('submit', app.handleSubmit);
    app.currentUserName = window.location.search.split('=')[1];
    app.fetch();
    // console.log(app.currentUserName);
  },

  currentRoomName: 'Default Room',

  currentUserName: null,

  currentData: null,

  allRooms: {
    'Default Room': 'Default Room',
  },

  friends: {

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
        app.fetch();
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
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.currentData = data;
        console.log(app.currentData);
        app.handleRefresh(data);
        //app.filterMessagesByRoom(data);
        app.filterExistingRooms(data);
        console.log(app.allRooms);
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
    text = message.text || '';
    // if thew text includes <,>,/,\,",',& dont include it
    for (var i = 0; i < text.length; i++) {
      if (text[i] === '<' || text[i] === '>' || text[i] === '&' || text[i] === '"' || text[i] === '\'' || text[i] === '\\' || text[i] === '/') {
        text = 'pwn denied';
        break;
      }
    }
    username = message.username || 'Anonymous';
    for (var i = 0; i < username.length; i++) {
      if (username[i] === '<' || username[i] === '>' || username[i] === '&' || username[i] === '"' || username[i] === '\'' || username[i] === '\\' || username[i] === '/') {
        username = 'pwn denied';
        break;
      }
    }
    roomname = message.roomname || 'Default room';
    for (var i = 0; i < roomname.length; i++) {
      if (roomname[i] === '<' || roomname[i] === '>' || roomname[i] === '&' || roomname[i] === '"' || roomname[i] === '\'' || roomname[i] === '\\' || roomname[i] === '/') {
        roomname = 'pwn denied';
        break;
      }
    }
    $username = $(`<div class="username" onclick="app.handleUsernameClick('${username}')">${username}</div>`);
    if (app.friends[username]) {
      $username.addClass('friend');
    }
    // ${roomname}
    // ${text}
    $message = $('<div class="message"></div>');
    $messageBody = $(`<div>${text}</div>`);
    $username.appendTo($message);
    $messageBody.appendTo($message);
    $message.appendTo('#chats');
  },

  filterMessagesByRoom: function(filteredRoom) {
    let selectedRoom = filteredRoom;
    app.clearMessages();
    var data = app.currentData.results;
    if (selectedRoom === 'Default room') {
      app.handleRefresh(app.currentData);
    }
    for (var i = 0; i < data.length; i++) {
      if (selectedRoom === data[i].roomname) {
        app.renderMessage(data[i]);
      }
    }
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
      app.allRooms[newRoom] = newRoom;
      app.renderRoom(newRoom);
    } else {
      app.filterMessagesByRoom(roomName);
    }
  },

  filterExistingRooms: function(data) {
    for (let i = 0; i < data.results.length; i++) {
      let newRoomName = data.results[i].roomname;
      if (newRoomName && !app.allRooms[newRoomName]) {
        //debugger;
        for (let j = 0; j < newRoomName.length; j++) {
          if (newRoomName[j] === '<' || newRoomName[j] === '>' || newRoomName[j] === '&' || newRoomName[j] === '"' || newRoomName[j] === '\'' || newRoomName[j] === '\\' || newRoomName[j] === '/') {
            newRoomName = 'badRoomName';
            break;
          }
        }
        if (newRoomName !== 'badRoomName') {
          app.allRooms[newRoomName] = newRoomName;
          app.renderRoom(newRoomName);
        } 
      }
    }
  },

  handleUsernameClick: function (username) {
    // var username = $('.username').text();
    if (!app.friends[username]) {
      app.friends[username] = true;
    } else {
      app.friends[username] = !(app.friends[username]);
    }
    app.handleRefresh(app.currentData);
    console.log(app.friends);
    console.log(username);
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
    
    // app.handleRefresh(app.currentData);
  },

  handleRefresh: function(newData) {
    app.clearMessages();
    var data = newData.results;
    for (var i = 0; i < data.length; i++) {
      app.renderMessage(data[i]);

    }
  }
};

$(app.init);
