<template>
  <div>
    <label for="max-words">Max. number of words (approx.):</label>
    <input type="number" name="max-words" :value=maxWords min="10" max="100" step="10">
    <label for="select-language">Language of text:</label>
    <select name="select-language">
      <option value="en">English</option>
    </select>
  </div>
</template>

<script>
// Array of available languages for search text and associated URLs of APIs
const languages = [
  {
    language: "en",
    url: "en.wikipedia.org"
  },
  {
    language: "de",
    url: "de.wikipedia.org"
  }
];

export default {
  name: "Settings",
  data: function() {
    return {
      maxWords: 10,
      language: "en"
    };
  }
};
</script>

<style lang="scss">
</style>
