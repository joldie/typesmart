<template>
  <div class="test-control-wrapper">
    <div class="timer-button-wrapper">
      <button ref="startStopButton" @click="startStop">
        <font-awesome-icon :icon="running ? 'pause' : 'play'"></font-awesome-icon>
      </button>
      <button @click="reset">
        <font-awesome-icon icon="undo"></font-awesome-icon>
      </button>
    </div>
    <SpeedDisplay :speed="speed"/>
  </div>
</template>

<script>
// Custom components
import SpeedDisplay from "./SpeedDisplay.vue";

// Improves on setTimeout() function which is known to drift over time
const accurateInterval = require("../../modules/accurate-interval.js");

export default {
  name: "TestControl",
  components: {
    SpeedDisplay
  },
  props: {
    running: Boolean,
    timeLimit: Number,
    speed: Number
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
    },
    // Set window focus to start button for quick start
    focus: function() {
      this.$refs.startStopButton.focus();
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
.test-control-wrapper {
  width: 100%;
  font-size: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.timer-button-wrapper {
  align-self: flex-end;
  justify-self: left;
}
button {
  height: 32px;
  font-size: 16px;
  margin-right: 5px;
}
@media screen and (max-width: 500px) {
  button {
    font-size: 14px;
    padding-left: 4px;
    padding-right: 4px;
    width: 36px;
    margin-right: 2px;
  }
}
</style>
