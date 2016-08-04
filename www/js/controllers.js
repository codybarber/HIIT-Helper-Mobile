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
      console.log("raise");
    };
    sounds.lowerVol = function() {
      player.setVolume(0.04);
      console.log("lower");
    };
  });
  return sounds;
})



.controller('DashCtrl', function($scope, soundcloud) {
  var amount = 0;

  var slider = $('#slider').CircularSlider({
      radius: 75,
      innerCircleRatio: '0.5',
      handleDist: 100,
      min: 0,
      max: 359,
      value: 0,
      clockwise: true,
      labelSuffix: "",
      labelPrefix: "",
      shape: "Half Circle",
      touch: true,
      animate: true,
      animateDuration : 360,
      selectable: false,
      slide: function(ui, value) {},
      onSlideEnd: function(ui, value) {},
      formLabel: undefined
  });

    $('.intervals').submit(function(event) {
      event.preventDefault();
      state = 'on';
      var amount = $('.amount').val();
      amount = Number(amount);
      cycle(amount);
      soundcloud.play();
    });

    $('.stopMusic').click(function(event) {
      event.preventDefault();
      state = 'off';
      document.getElementById('startButton').disabled = false;
      soundcloud.stop();
      console.log("Player Stopped");
    });

    function workoutCountdown(element, minutes, seconds) {
      var time = minutes*60 + seconds;
      var interval = setInterval(function() {
        var el = document.getElementById(element);
        if(time === 0) {
          el.innerHTML = "Time for a break!";
          clearInterval(interval);
          return;
        }
        console.log("element: " + el);
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
      if (amount <= 0) {
        soundcloud.stop();
        return;
      }
      if (state === 'on') {
        document.getElementById('startButton').disabled = true;
        // var intervalTime = $('.exercise').val();
        var intervalTime = $('.jcs-value').text();
        console.log(intervalTime);
        intervalTime = Number(intervalTime);
        if (state === 'off') {
          console.log("State off");
          return;
        } else {
          console.log(intervalTime);
          workoutCountdown('exerciseTimer', 0, intervalTime);
          var cooldownTime = $('.cooldown').val();
          cooldownTime = Number(cooldownTime);
          setTimeout(function() {
            // turn down volume
            // soundcloud.lowerVol();
            if (state === 'off') {
              console.log('State off');
              return;
            } else {
              cooldownCountdown('cooldownTimer', 0, cooldownTime);
              setTimeout(function() {
                // turn up volume
                // soundcloud.raiseVol();
                cycle(amount - 1);
              }, cooldownTime * 1000 + 1000);
            }
          }, intervalTime * 1000 + 1000);
        }
      }
    }
});
