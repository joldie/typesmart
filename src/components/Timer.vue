<template>
  <div class="timer-wrapper">
    <div class="timer-button-wrapper">
      <button @click="startStop">
        <font-awesome-icon :icon="running ? 'pause' : 'play'"></font-awesome-icon>
      </button>
      <button @click="reset">
        <font-awesome-icon icon="undo"></font-awesome-icon>
      </button>
    </div>
    <div class="speed-display">
      <div class="speed-colour-circle">
        <div class="speed-circle-mask1">
        <div class="speed-circle-mask2">
          <span class="speed-text">
            {{speed}}
          </span>
          <span class="small-speed-text">wpm</span>
        </div>
      </div>
      </div>
    </div>
    <span class="time-display" v-bind:class="{ 'red-highlight': running && secondsLeft <= 10 }" >
      <font-awesome-icon icon="stopwatch"></font-awesome-icon>
      {{timeLeft}}
    </span>
  </div>
</template>

<script>
// Improves on setTimeout() function which is known to drift over time
const accurateInterval = require("../../libraries/Accurate_Interval.js");

export default {
  name: "Timer",
  props: {
    running: Boolean,
    timeLimit: Number,
    speed: String
  },
  data: function() {
    return {
      secondsLeft: 0,
      intervalID: ""
    };
  },
  computed: {
    // Format number of seconds into minutes:seconds (e.g. 90s -> "01:30")
    timeLeft: function() {
      let minutes = Math.floor(this.secondsLeft / 60);
      let seconds = this.secondsLeft % 60;
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return minutes + ":" + seconds;
    }
  },
  methods: {
    // Start or pause countdown, depending on current program state
    startStop: function() {
      if (this.running) {
        this.intervalID && this.intervalID.cancel();
        // Pass change state event up to parent for action
        this.$emit("change-timer-state", false);
      } else {
        // Start countdown
        this.startCountdown();
        // Pass change state event up to parent for action
        this.$emit("change-timer-state", true);
      }
    },
    // Start countdown
    startCountdown: function() {
      this.intervalID = accurateInterval(() => {
        // Decrement timer
        this.secondsLeft--;
        // Pass new time event, with current elapsed time, to parent for action
        this.$emit("one-second-elapsed", this.timeLimit - this.secondsLeft);
        if (this.secondsLeft < 0) {
          this.intervalID && this.intervalID.cancel();
          this.secondsLeft = 0;
          // Pass timer state event up to parent for action
          this.$emit("timer-ended", false);
        }
      }, 1000);
    },
    // Reset timer to default settings and reset test fields
    reset: function() {
      this.intervalID && this.intervalID.cancel();
      this.secondsLeft = this.timeLimit;
      // Pass reset test event up to parent for action
      this.$emit("reset-test");
    }
  },
  mounted: function() {
    this.secondsLeft = this.timeLimit;
  },
  watch: {
    timeLimit: function() {
      this.reset();
    }
  }
};
</script>

<style scoped lang="scss">
.timer-wrapper {
  width: 100%;
  font-size: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.timer-button-wrapper {
  align-self: flex-end;
  justify-self: left;
}
.time-display {
  align-self: flex-end;
  justify-self: right;
}
button {
  height: 32px;
  font-size: 16px;
  margin-right: 5px;
}
.red-highlight {
  color: red;
}
@media screen and (max-width: 500px) {
  button {
    font-size: 14px;
  }
}

.speed-display {
  align-self: center;
  justify-self: center;
  width: 120px;
  height: 60px;
  overflow: hidden;
}

.speed-colour-circle {
  position: relative;
  top: 10px;
  left: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}

.speed-colour-circle:before {
  box-sizing: border-box;
  transform: scale(1);
  -webkit-filter: blur(20px) saturate(1.1) brightness(1.1);
  filter: blur(20px) saturate(1.1) brightness(1.1);
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  top: -50%;
  left: -50%;
  padding-top: 100%;
  background-image: linear-gradient(330deg, transparent 50%, #50b517 50%),
    linear-gradient(300deg, transparent 50%, green 50%),
    linear-gradient(270deg, transparent 50%, green 50%),
    linear-gradient(240deg, transparent 50%, green 50%),
    linear-gradient(210deg, transparent 50%, red 50%),
    linear-gradient(180deg, transparent 50%, red 50%),
    linear-gradient(150deg, transparent 50%, #ff5800 50%),
    linear-gradient(120deg, transparent 50%, #ff8100 50%),
    linear-gradient(90deg, transparent 50%, #feac00 50%),
    linear-gradient(60deg, transparent 50%, #ffcc00 50%),
    linear-gradient(30deg, transparent 50%, #ede604 50%),
    linear-gradient(0deg, transparent 50%, #9ed110 50%);
  background-clip: content-box, content-box, content-box, content-box,
    content-box, content-box, padding-box, padding-box, padding-box, padding-box,
    padding-box, padding-box;
}

.speed-circle-mask1 {
  position: relative;
  right: 0px;
  bottom: 0px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: linear-gradient(126deg, transparent 50%, white 50%),
    linear-gradient(0deg, white 50%, transparent 50%);
}

.speed-circle-mask2 {
  position: relative;
  left: 10px;
  top: 10px;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}
.speed-text {
  position: relative;
  top: 7px;
  text-align: center;
  font-size: 22px;
}
.small-speed-text {
  position: absolute;
  top: 30px;
  left: 55px;
  font-size: 8px;
  color: grey;
}
</style>
