<template>
  <div class="typed-text-wrapper">
    <input id="typingInput" type="text" placeholder="Type here" v-on:keyup="keyPressed">
  </div>
</template>

<script>
export default {
  name: "TypedText",
  methods: {
    keyPressed: function() {
      this.$emit("key-pressed", document.querySelector("#typingInput").value);
    }
  }
};
</script>

<style scoped lang="scss">
.typed-text-wrapper {
  width: 100%;
  max-width: 800px;
  border: 1px solid black;
  margin: 5px;
  #typingInput {
    width: 100%;
    font-size: 20px;
  }
}
</style>
