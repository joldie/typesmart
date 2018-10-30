<template>
  <!-- Override default form submit behaviour to avoid CORS issue during API call -->
  <form onSubmit="return false">  
    <input
      ref="input"
      type="text"
      :placeholder=placeholderText
      required=true >
    <button v-on:click="buttonClicked">Get new text</button>
  </form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    placeholderText: String
  },
  methods: {
    buttonClicked: function() {
      this.$emit("search-button-clicked", this.$refs.input.value);
    }
  }
};
</script>

<style scoped lang="scss">
form {
  margin: 5px;
}
</style>
