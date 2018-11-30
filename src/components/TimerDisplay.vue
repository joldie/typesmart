<template>
  <div class="timer-display-wrapper">
    <div
      class="timer-bar"
      :style="timerWidthStyle"
      v-bind:class="{ 'red-highlight': running && secondsLeft <= 10 }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "TimerDisplay",
  props: {
    running: Boolean,
    secondsLeft: Number,
    timeLimit: Number
  },
  computed: {
    timerWidthStyle() {
      return `width: ${(this.secondsLeft / this.timeLimit) * 100}%; !important`;
    }
  }
};
</script>

<style scoped lang="scss">
.timer-display-wrapper {
  width: 100%;
  height: 9px;
  border: 1px solid rgb(184, 184, 184);
  border-radius: 3px;
  padding: 1px;
  .timer-bar {
    height: 100%;
    background-color: rgb(0, 162, 255);
  }
}
.red-highlight {
  background-color: rgb(255, 30, 0) !important;
}
</style>
