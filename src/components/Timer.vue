<template>
  <div>
    <button v-on:click="startStop">
      <font-awesome-icon :icon="running ? 'pause' : 'play'"></font-awesome-icon>
    </button>
    <button v-on:click="reset">
      <font-awesome-icon icon="undo"></font-awesome-icon>
    </button>
    <span>
      <font-awesome-icon icon="stopwatch"></font-awesome-icon>
      {{timeLeft}}
    </span>
  </div>
</template>

<script>
// Improves on setTimeout() function which is known to drift over time
const accurateInterval = require("../Accurate_Interval.js");

export default {
  name: "Timer",
  props: {
    running: Boolean
  },
  data: function() {
    return {
      secondsLeft: 120,
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
        this.changeState(false);
      } else {
        // Start countdown
        this.startCountdown();
        this.changeState(true);
      }
    },
    // Start countdown
    startCountdown: function() {
      this.intervalID = accurateInterval(() => {
        this.secondsLeft--;
        if (this.secondsLeft < 0) {
          this.intervalID && this.intervalID.cancel();
          this.changeState(false);
        }
      }, 1000);
    },
    // Reset timer to default settings and reset test fields
    reset: function() {
      this.intervalID && this.intervalID.cancel();
      this.secondsLeft = 120;
      // Pass reset test event up to parent for action
      this.$emit("reset-test");
    },
    // Pass change state event up to parent for action
    changeState: function(boolean) {
      this.$emit("change-timer-state", boolean);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
