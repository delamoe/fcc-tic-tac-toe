var winsObj = {
    top: {
      win: ['tl', 'tc', 'tr'],
      title: 'Across the top!'
    },
    mid: {
      win: ['cl', 'cc', 'cr'],
      title: 'Horizontal bop!'
    },
    bot: {
      win: ['bl', 'bc', 'br'],
      title: 'Low and slow is the tempo!'
    },
    lef: {
      win: ['tl', 'cl', 'bl'],
      title: 'Southpaw slider!'
    },
    cen: {
      win: ['tc', 'cc', 'bc'],
      title: 'Straight up the middle!'
    },
    rit: {
      win: ['tr', 'cr', 'br'],
      title: 'Right as rain!'
    },
    xdn: {
      win: ['tl', 'cc', 'br'],
      title: 'Left to right & top to bottom!'
    },
    xup: {
      win: ['bl', 'cc', 'tr'],
      title: 'Climb those stairs!'
    }
  },
  usedSquare,
  movArr,
  movLen,
  winText,
  human,
  ai,
  count = 0,
  draws = 0,
  winsArr = {
    x: [],
    o: []
  };
$(document).ready(start());

function start() {
    alert('started');
  $('#playModal')
    .modal({
      backdrop: 'static',
      keyboard: false
    }).on('click', '[data-value]', function() {
      human = $(this).data('value').toLowerCase();
      if (human === 'x') ai = 'o';
      else ai = 'x';
      //console.logconsole.log('human is ' + human + '\n' + 'ai is ' + ai + '\n' + human + ' goes first');
      reSet();
    });
}

function reSet() {
  count++;

  $('#games').html('Game: ' + count);
  $('.square').css("color", "#2E4052");
  $('.square').empty();

  usedSquare = {
      'tl': false,
      'tc': false,
      'tr': false,
      'cl': false,
      'cc': false,
      'cr': false,
      'bl': false,
      'bc': false,
      'br': false
    },
    movArr = {
      x: [],
      o: []
    },
    movLen = 0,
    winText = '';
  //console.logconsole.log('starting ', movLen, movArr, usedSquare);

  if (count % 2 !== 0) {
    humanMove();
  } else {
    aiMove();
  }

}

//humanMove;
function humanMove() {
  //console.log('MOVE PUNY HUMAN!!');
  $('#turn').html("Human's turn");
  $('.square').on('click', function() {
    $('.square').off('click');
    // check if clicked square is blank
    if (usedSquare[$(this).attr('id')] === false) {
      // mark square as x or o
      $(this).html('<div>' + human.toUpperCase() + '</div>');
      //console.log('Human chose: ' + $(this).attr('id') /*+ '\n' + 'movLen: ' + movLen + '\n', movArr, usedSquare*/);
      movLen++;
      // set square state to true (used)
      usedSquare[$(this).attr('id')] = true;
      // add square to list of human moves
      movArr[human].push($(this).attr('id'));
      setTimeout(function() {
        if (checkWin(human) === false) aiMove();
      }, 25);
    }
  });
}
// end of humanMove()

//checkWin
function checkWin(turn) {
  //console.log('checkWin for: ' + turn);
  var player = turn === human ? 'Human' : 'AI';
  var win = winBlockCheck(turn + 'Check');
  //console.log(winBlockCheck(turn + 'Check'));
  if (win) {
    winText = player.toUpperCase() + " WINS!!!<br/>" + winsObj[win].title;
    //console.log(winText);
    winsArr[turn].push('w');
    $('#' + player.toLowerCase()).html(player + " wins: " + winsArr[turn].length);
    // draw win graphic
    for (var i in winsObj[win].win) {
      $('#' + winsObj[win].win[i]).css("color", "#A4031F");
      $('#' + winsObj[win].win[i]).children().fadeOut(400, 'swing').fadeIn(400, 'swing').fadeOut(400, 'swing').fadeIn(400, 'swing').fadeOut(400, 'swing').fadeIn(400, 'swing');
    }
    //alert(winText + " Click 'OK' to continue.");
    //window.location.reload(true);
    setTimeout(function() {
      reSet();
    }, 2500);
  }
  // check for draw
  if (movLen === 9 && winText === '') {
    draws++;
    $('#draw').html("Draws: " + draws);
    winText = "It's a draw. Click 'OK' to continue.";
    //alert(winText);
    //window.location.reload(true);
    setTimeout(function() {
      reSet();
    }, 250);
  }
  // check if game is not over
  if (movLen < 9 && winText === '') {
    //console.log(player.toUpperCase() + ' DID NOT WIN');

    // return false to caller *Move()
    return false;
  }
}
// end of checkWin()

// aiMove
function aiMove() {
  $('#turn').html("AI's turn");
  var move = chooseMove();
  //setTimeout(function() {
  aiMark(move);
  //}, 500);
  setTimeout(function() {
    if (checkWin(ai) === false) humanMove();
  }, 350);
}
function aiMark(square) {
  $('#' + square).html('<div>' + ai.toUpperCase() + '</div>');
  usedSquare[square] = true;
  //console.log('AI chose: ' + square /*+ '\n' + 'movLen: ' + movLen + '\n', movArr, usedSquare*/);
  movArr[ai].push(square);
  movLen++;
}
// if the niddle square is open after the fisrt move, then take it
function chooseMove() {

  //console.log('cornerBlock');
  var cb = cornerBlock();
  //console.log('cornerBlock: ' + cb);
  if (cb !== undefined && usedSquare[cb] === false) {
    return cb;
  }

  if (movLen > 0 && usedSquare.cc === false) {
    //console.log('after first move, middle square mode');
    return 'cc';
  }
  // if the niddle square is taken, select a corner
  if (movLen < 2 || movLen === 0 && usedSquare.cc === true) {
    //console.log('after first move, corner square mode');
    var cornerArr = ['tl', 'tr', 'bl', 'br'],
      c = getRandInt(0, cornerArr.length - 1);
    return cornerArr[c];
  }

  //console.log('ai win2 mode');
  if (winBlockCheck('win2') !== false) {
    return winBlockCheck('win2');
  }

  //console.log('ai block2 mode');
  if (winBlockCheck('block2') !== false) {
    return winBlockCheck('block2');
  }

  /*
  *
  *
  //console.log('ai win1 mode');
  if (winBlockCheck('win1') !== false) {
    return winBlockCheck('win1');
  }
  *
  */

  //console.log('ai block1 mode');
  if (winBlockCheck('block1') !== false) {
    return winBlockCheck('block1');
  }

  // if no human move to block, find a complimentary ai move

  // or just make it a random choice to make the game more fun

  //console.log('random choice of remaining mode');
  // create an array of the remaining open squares
  var remainSq = [];
  for (var key in usedSquare) {
    //console.log(key, usedSquare[key]);
    if (usedSquare[key] === false) {
      remainSq.push(key);
    }
  }
  //select a random square from the array
  var r = getRandInt(0, remainSq.length - 1);
  return remainSq[r];
}
// end of aiChoose()
 
// find a win if more than two on the board // call arguments are <current turn>,3
//function winOrBlock(turn,num) {
function winBlockCheck(arg) {
  //console.log(arg);
  var turn, num;

  if (arg === 'win2') {
    turn = ai;
    num = 2;
  }

  if (arg === 'block2') {
    turn = human;
    num = 2;
  }

  if (arg === 'win1') {
    turn = ai;
    num = 1;
  }

  if (arg === 'block1') {
    turn = human;
    num = 1;
  }

  if (arg === 'oCheck') {
    turn = 'o';
    num = 3;
  }
  if (arg === 'xCheck') {
    turn = 'x';
    num = 3;
  }

  // //console.log('turn|num: ' + turn + '|' + num);
  //var noTurn = turn === ai ? human : ai;
  for (var i in winsObj) {
    var matches = 0,
      thisMove = [];
    // //console.log('checking ' + turn + ' against ' + winsObj[i].win);
    thisMove = thisMove.concat(winsObj[i].win);
    // iterate through winsObj winning arrays
    for (var j in winsObj[i].win) {
      // iterate through completed moves of turn
      for (var k in movArr[turn]) {
        // compare complteted moves with wins
        if (winsObj[i].win[j] === movArr[turn][k]) {
          //remove matches (unavailable moves)
          thisMove = destroyer(thisMove, [movArr[turn][k]]);
          matches++;
          //console.log('', movArr[turn][k], ' = ', winsObj[i].win[j], '\n', 'matches so far ', matches);

          // check to see if can win
          if (arg === 'oCheck' || arg === 'xCheck') {
            if (matches === num) {
              return i;
            }
          }

          if (arg !== ('oCheck' || 'xCheck') && matches === num && usedSquare[thisMove[0]] === false) {
            return thisMove[0];
          }
        }
      }
    }
  }
  return false;
}

// look for two moves on adjacent sides in order to block both with a corner move
function cornerBlock() {
  // matches determine in which corner to move
  var str = '';

  // iterate over corner arrays

  // if (movLen === 3) {
  if (isTrue('mid') === true && isTrue('cen') === true) {
    if (isTrue('top') === true) {
      str = str + 't';

    }
    if (isTrue('bot') === true) {
      str = str + 'b';

    }
    if (isTrue('lef') === true) {
      str = str + 'l';

    }
    if (isTrue('rit') === true) {
      str = str + 'r';

    }
    if (str.length === 2) {
      //console.log(str);
      return str;
    } else {
      return;
    }
  }
  // }

  function isTrue(arr) {
    // iterate through winsObj.win array
    for (var i in winsObj[arr].win) {
      //console.log('2: (i) ' + winsObj[arr].win[i]);
      // iterate through completed moves of turn
      for (var k in movArr[human]) {
        //console.log('4: (k) ' + movArr[human]);
        // compare complteted moves with wins
        if (winsObj[arr].win[i] === movArr[human][k]) {
          //console.log(arr + ' is true');
          return true;
        }
      }
    }
  }
}

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this can be replaced with a simpler arr.filter()
function destroyer(arr, sq) {
  // Remove all the values
  var /*send output of .filter() to...*/ remaining = arr.filter(function(val) {
    //.filter() keeps true elements
    var noMatch = true; //set to keep
    for (i = 0; i < sq.length; i++) {
      if (val === sq[i]) { //prove me wrong
        noMatch = false; // if the element matches
      }
    }
    return noMatch; // send true or false to the .filter() method
  });
  return remaining; // return the new filtered array
}
