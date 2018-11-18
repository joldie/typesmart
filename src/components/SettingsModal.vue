<template>
  <div class="page-mask">
    <div class="settings-wrapper">
      <div class="title-wrapper">
        <h3>Settings</h3>
        <button class="close-button" @click="$emit('close')">
          <font-awesome-icon icon="times"></font-awesome-icon>
        </button>
      </div>
      <div class="options-wrapper">
        <label for="time-limit">Time limit (seconds):</label>
        <br/>
        <input type="number" name="time-limit" v-model="selectedTimeLimit"
          @change="timeLimitSelected" min="30" max="600" step="10">
        <br/>
        <label for="max-words">Text word limit:</label>
        <br/>
        <input type="number" name="max-words" v-model="selectedWordLimit"
          @change="maxWordsSelected" min="10" max="100" step="10">
        <br/>
        <label for="select-language">Text source:</label>
        <br/>
        <select name="select-language" v-model="selectedApiUrl" @change="languageSelected">
          <option v-for="(lang, index) in availableLanguages" v-bind:value="lang.urlAPI" :key="index">
          {{ lang.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data: function() {
    return {
      selectedTimeLimit: 120,
      selectedWordLimit: 30,
      // Default API is English Wikipedia
      selectedApiUrl: "https://en.wikipedia.org/api/rest_v1/page/",
      // Array of available languages for search text and associated URLs of APIs
      availableLanguages: [
        {
          name: "English Wikipedia",
          urlAPI: "https://en.wikipedia.org/api/rest_v1/page/"
        },
        {
          name: "Simple English Wikipedia",
          urlAPI: "https://simple.wikipedia.org/api/rest_v1/page/"
        },
        {
          name: "German Wikipedia",
          urlAPI: "https://de.wikipedia.org/api/rest_v1/page/"
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
.page-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.settings-wrapper {
  width: 300px;
  background: white;
  padding: 15px;
  font-size: 16px;
  .title-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    h3 {
      margin-top: 0;
    }
    .close-button {
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      font-size: 20px;
      height: 24px;
      &:hover {
        color: grey;
      }
    }
  }
  .options-wrapper {
    display: grid;
    grid-template-rows: auto;
    grid-row-gap: 5px;
    select,
    input {
      justify-self: center;
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
