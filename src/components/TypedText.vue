<template>
  <div class="typed-text-wrapper">
    <input
      ref="input"
      type="text"
      placeholder="Type here"
      @keyup="keyPressed"
      :disabled=!inputEnabled >
  </div>
</template>

<script>
export default {
  name: "TypedText",
  props: {
    inputEnabled: Boolean
  },
  methods: {
    // Pass keyboard event up to parent for action
    keyPressed: function() {
      this.$emit("key-pressed", this.$refs.input.value);
    },
    // Set window focus to input typing field during test
    focus: function() {
      this.$refs.input.focus();
    },
    // Clear typing input field
    clear: function() {
      this.$refs.input.value = "";
    }
  }
};
</script>

<style scoped lang="scss">
.typed-text-wrapper {
  width: 100%;
  border: 1px solid black;
  padding: 5px;
  input {
    width: 100%;
    font-size: 20px;
  }
}
.red-highlight {
  background: #d08383;
}
</style>
