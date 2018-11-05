<template>
  <div class="timer-wrapper">
    <div>
      <button @click="startStop">
        <font-awesome-icon :icon="running ? 'pause' : 'play'"></font-awesome-icon>
      </button>
      <button @click="reset">
        <font-awesome-icon icon="undo"></font-awesome-icon>
      </button>
    </div>
    <span class="speed-display">
        {{speed}} wpm
      </span>
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
.speed-display {
  align-self: center;
  justify-self: center;
}
.time-display {
  align-self: center;
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
</style>
