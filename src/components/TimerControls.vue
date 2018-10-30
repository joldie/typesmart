<template>
  <div>
    <button v-on:click="startStopClicked">
      <font-awesome-icon :icon="timerRunning ? 'pause' : 'play'"></font-awesome-icon>
      </button>
    <button v-on:click="resetClicked">
      <font-awesome-icon icon="undo"></font-awesome-icon>
      </button>
    <span><font-awesome-icon icon="stopwatch"></font-awesome-icon> {{timeLeft}}</span>
    </div>
</template>

<script>
export default {
  name: "TimerControls",
  props: {
    timerRunning: Boolean,
    timeLeft: String
  },
  methods: {
    startStopClicked: function() {
      this.$emit("start-stop-clicked");
    },
    resetClicked: function() {
      this.$emit("reset-clicked");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
