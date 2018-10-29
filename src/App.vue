<template>
  <div id="app">
    <h1>Typing Test</h1>
    <form onSubmit="return false">
      <!-- Override default form submit behaviour to avoid CORS issue during API call -->
      <input id="searchInput" type="text" required=true>
      <button v-on:click="getNewText">Get new text</button>
    </form>
    <TargetText :text=targetText />
    <TypedText />
  </div>
</template>

<script>
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";

const exampleTopics = ["jaguar", "lion"];

const callAPI = async function(searchText) {
  const URL = "https://en.wikipedia.org/api/rest_v1/page/summary/" + searchText;
  const response = await fetch(URL);
  const jsonData = await response.json();
  return jsonData;
};

export default {
  name: "app",
  components: {
    TargetText,
    TypedText
  },
  data: function() {
    return {
      targetText: ""
    };
  },
  methods: {
    getNewText: async function() {
      // Search Wikipedia for title given in search box
      const searchText = document.querySelector("#searchInput").value;
      if (searchText.length !== 0) {
        // Perform API call to get summary text of topic
        const returnObject = await callAPI(searchText);
        if (returnObject.title === "Not found.") {
          alert(
            "'" +
              searchText +
              "' not found on Wikipedia.\nCheck your spelling or try another search term."
          );
        } else if (returnObject.type === "disambiguation") {
          alert(
            "'" +
              searchText +
              "' may refer to several topics.\nTry another search term or be more specific."
          );
        } else {
          // If topic found, save extract (summary) text to target text box
          this.saveText(returnObject.extract);
        }
      }
    },
    saveText: function(originalText) {
      // Not a hard limit. Algorithm will stop adding sentences only after limit has first been exceeded.
      const maxWords = 50;
      // Split text into sentences and save in array
      const sentences = this.numSentences(originalText);
      // Add sentences to text until word limit has been reached.
      let text = "";
      let i = 0;
      do {
        text = text + sentences[i];
        i++;
      } while (this.numWords(text) < maxWords && i < sentences.length);
      // Update target text display
      this.targetText = text;
    },
    numSentences: function(text) {
      // Note: regex fails with words that include periods, e.g. "Vue.js is great."
      const sentenceRegex = /["',;-\s\w]+[.?!](\s|$)/g;
      return text.match(sentenceRegex);
    },
    numWords: function(text) {
      const wordRegex = /\w+/g;
      return text.match(wordRegex).length;
    }
  },
  mounted: async function() {
    // Get random topic from example list to display on page load
    const exampleTopic =
      exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    const returnObject = await callAPI(exampleTopic);
    this.saveText(returnObject.extract);
    document.querySelector("#searchInput").placeholder =
      'e.g. "' + exampleTopic + '"';
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  color: black;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
form {
  margin: 5px;
}
</style>
