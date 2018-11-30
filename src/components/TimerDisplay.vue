<template>
  <div class="timer-display-wrapper">
    <span class="time-display" v-bind:class="{ 'red-highlight': running && secondsLeft <= 10 }">
      <font-awesome-icon icon="hourglass-half"></font-awesome-icon>
      {{timeLeft}}
    </span>
  </div>
</template>

<script>
export default {
  name: "TimerDisplay",
  props: {
    running: Boolean,
    secondsLeft: Number
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
  }
};
</script>

<style scoped lang="scss">
.time-display {
  align-self: flex-end;
  justify-self: right;
}
.red-highlight {
  color: red;
}
</style>
