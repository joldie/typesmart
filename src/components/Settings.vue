<template>
  <div>
    <h3>Settings</h3>
    <label for="max-words">Max. number of words (approx.):</label>
    <input type="number" name="max-words" v-model="selectedWordLimit"
      v-on:change="maxWordsSelected" min="10" max="100" step="10">
    <br/>
    <label for="select-language">Language of text:</label>
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
      selectedWordLimit: 10,
      // Default API is English Wikipedia
      selectedApiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
      // Array of available languages for search text and associated URLs of APIs
      availableLanguages: [
        {
          name: "English",
          urlAPI: "https://en.wikipedia.org/api/rest_v1/page/summary/"
        },
        {
          name: "Simple English",
          urlAPI: "https://simple.wikipedia.org/api/rest_v1/page/summary/"
        },
        {
          name: "Deutsch (German)",
          urlAPI: "https://de.wikipedia.org/api/rest_v1/page/summary/"
        }
      ]
    };
  },
  methods: {
    // Pass selected language to parent for action
    languageSelected: function() {
      this.$emit("new-language-selected", this.selectedApiUrl);
    },
    // Pass selected word limit to parent for action
    maxWordsSelected: function() {
      this.$emit("max-words-selected", this.selectedWordLimit);
    }
  }
};
</script>

<style lang="scss">
</style>
