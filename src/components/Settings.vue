<template>
  <div>
    <h3>Settings</h3>
    <label for="time-limit">Countdown time (s):</label>
    <input type="number" name="time-limit" v-model="selectedTimeLimit"
      v-on:change="timeLimitSelected" min="60" max="600" step="10">
    <br/>
    <label for="max-words">Text word limit:</label>
    <input type="number" name="max-words" v-model="selectedWordLimit"
      v-on:change="maxWordsSelected" min="10" max="100" step="10">
    <br/>
    <label for="select-language">Text source:</label>
    <select name="select-language" v-model="selectedApiUrl" v-on:change="languageSelected">
      <option v-for="(lang, index) in availableLanguages" v-bind:value="lang.urlAPI" :key="index">
      {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data: function() {
    return {
      selectedTimeLimit: 120,
      selectedWordLimit: 10,
      // Default API is English Wikipedia
      selectedApiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
      // Array of available languages for search text and associated URLs of APIs
      availableLanguages: [
        {
          name: "English Wikipedia",
          urlAPI: "https://en.wikipedia.org/api/rest_v1/page/summary/"
        },
        {
          name: "Simple English Wikipedia",
          urlAPI: "https://simple.wikipedia.org/api/rest_v1/page/summary/"
        },
        {
          name: "Deutsch (German) Wikipedia",
          urlAPI: "https://de.wikipedia.org/api/rest_v1/page/summary/"
        }
      ]
    };
  },
  methods: {
    // Pass selection to parent for action
    languageSelected: function() {
      this.$emit("new-language-selected", this.selectedApiUrl);
    },
    // Pass selection to parent for action
    maxWordsSelected: function() {
      this.$emit("max-words-selected", this.selectedWordLimit);
    },
    // Pass selection to parent for action
    timeLimitSelected: function() {
      this.$emit("time-limit-selected", this.selectedTimeLimit);
    }
  }
};
</script>

<style lang="scss">
</style>
