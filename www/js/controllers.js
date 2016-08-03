var state;
var interval;
angular.module('starter.controllers', [])

.factory('soundcloud', function($http) {
  var sounds = {};
  SC.initialize({
    client_id: 'b3741f25d7ee5ba87d9b29f79a1c578c'
  });
  SC.stream('/tracks/198478194').then(function(player) {
    sounds.play = function() {
      player.play();
    };
    sounds.stop = function() {
      player.pause();
    };
    sounds.raiseVol = function() {
      player.setVolume(0.9);
    };
    sounds.lowerVol = function() {
      player.setVolume(0.02);
    };

  });
  return sounds;
})



.controller('DashCtrl', function($scope, soundcloud) {
  var amount = 0;

    $('.intervals').submit(function(event) {
      event.preventDefault();
      state = 'on';
      var amount = $('.amount').val();
      amount = Number(amount);
      cycle(amount);
      soundcloud.play();
    });

    $('.stopVideo').click(function(event) {
      event.preventDefault();
      state = 'off';
      document.getElementById('startButton').disabled = false;
      soundcloud.stop();
      console.log("Player Stopped");
    });

    function workoutCountdown(element, minutes, seconds) {
      document.getElementById('player').volume = 1.0;
      var time = minutes*60 + seconds;
      var interval = setInterval(function() {
        var el = document.getElementById(element);
        if(time === 0) {
          el.innerHTML = "Time for a break!";
          clearInterval(interval);
          return;
        }
        var minutes = Math.floor(Number( time / 60 ));
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds;
        var text = minutes + ':' + seconds;
        el.innerHTML = text;
        time--;
      }, 1000);
    }

    function cooldownCountdown(element, minutes, seconds) {
      document.getElementById('player').volume = 0.2;
      var time = minutes*60 + seconds;
      var interval = setInterval(function() {
        var el = document.getElementById(element);
        if(time === 0) {
          el.innerHTML = "Let's Go!";
          clearInterval(interval);
          return;
        }
        var minutes = Math.floor(Number( time / 60 ));
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds;
        var text = minutes + ':' + seconds;
        el.innerHTML = text;
        time--;
      }, 1000);
    }

    function cycle(amount) {
      if (amount <= 0) return;
      if (state === 'on') {
        document.getElementById('startButton').disabled = true;
        var intervalTime = $('.exercise').val();
        intervalTime = Number(intervalTime);
        if (state === 'off') {
          console.log("State off");
          return;
        } else {
          workoutCountdown('exerciseTimer', 0, intervalTime);
          var cooldownTime = $('.cooldown').val();
          cooldownTime = Number(cooldownTime);
          setTimeout(function() {
            // turn down volume
            soundcloud.lowerVol();
            if (state === 'off') {
              console.log('State off');
              return;
            } else {
              cooldownCountdown('cooldownTimer', 0, cooldownTime);
              setTimeout(function() {
                // turn up volume
                soundcloud.raiseVol();
                cycle(amount - 1);
              }, cooldownTime * 1000 + 1000);
            }
          }, intervalTime * 1000 + 1000);
        }
      }
    }
});
