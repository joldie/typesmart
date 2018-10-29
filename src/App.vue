<template>
  <div id="app">
    <h1>Typing Test</h1>
    <form onSubmit="return false">
      <!-- Override default form submit behaviour to avoid CORS issue during API call -->
      <input id="searchInput" type="text" required=true>
      <button v-on:click="getNewText">Get new text</button>
    </form>
    <TargetText
      :text1=completedText
      :text2=correctLetters
      :text3=incorrectLetters
      :text4=untypedLetters
      :text5=remainingText />
    <TypedText
      v-bind:class="{ 'red-highlight': wrongInput }"
      v-on:key-pressed="keyPressed" />
  </div>
</template>

<script>
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";

const exampleTopics = [
  "jaguar",
  "rock climbing",
  "Russian revolution",
  "Uganda",
  "javascript",
  "David Bowie",
  "Homage to Catalonia",
  "jupiter",
  "ecology"
];

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
      completedText: "",
      correctLetters: "",
      incorrectLetters: "",
      untypedLetters: "",
      remainingText: "",
      nextWord: ""
    };
  },
  computed: {
    wrongInput: function() {
      return this.incorrectLetters.length > 0 ? true : false;
    }
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
          this.saveNewText(returnObject.extract);
          this.getNextWord();
        }
      }
    },
    saveNewText: function(originalText) {
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
      // Trim any whitespace from end and update target text display
      this.remainingText = text.trim();
      this.nextWord = "";
      this.correctLetters = "";
      this.incorrectLetters = "";
    },
    numSentences: function(text) {
      // Note: regex fails with words that include periods, e.g. "Vue.js is great."
      const sentenceRegex = /["',;-\s\w]+[.?!](\s|$)/g;
      return text.match(sentenceRegex);
    },
    numWords: function(text) {
      const wordRegex = /\w+/g;
      return text.match(wordRegex).length;
    },
    getNextWord: function() {
      // Starting from start of remaining text, look for next space or end of paragraph
      let endPosition = 0;
      while (
        this.remainingText[endPosition] !== " " &&
        endPosition < this.remainingText.length
      ) {
        endPosition++;
      }
      // If not final word in text, include space character in nextWord variable
      if (endPosition !== this.remainingText.length) {
        endPosition++;
      }
      this.nextWord = this.remainingText.substring(0, endPosition);
      this.remainingText = this.remainingText.substring(endPosition);
      this.untypedLetters = this.nextWord;
      this.correctLetters = "";
      this.incorrectLetters = "";
    },
    keyPressed: function(typedText) {
      if (typedText === this.nextWord) {
        this.completedText += typedText;
        document.querySelector("#typingInput").value = "";
        if (this.remainingText.length === 0) {
          alert("Done!");
          // Do something here...
        } else {
          this.getNextWord();
        }
      } else {
        this.checkTypedLetters(typedText);
      }
    },
    checkTypedLetters: function(typedText) {
      let letterPosition = 0;
      let numCorrect = 0;
      let numIncorrect = 0;
      while (
        typedText[letterPosition] === this.nextWord[letterPosition] &&
        letterPosition < typedText.length
      ) {
        numCorrect++;
        letterPosition++;
      }
      this.correctLetters = this.nextWord.substring(0, numCorrect);
      if (letterPosition !== this.nextWord.length) {
        // Some letters are remaining to be correctly typed
        numIncorrect = typedText.length - numCorrect;
        if (numCorrect + numIncorrect < this.nextWord.length) {
          this.incorrectLetters = this.nextWord.substring(
            numCorrect,
            numCorrect + numIncorrect
          );
          this.untypedLetters = this.nextWord.substring(
            numCorrect + numIncorrect
          );
        } else {
          this.incorrectLetters = this.nextWord.substring(numCorrect);
          this.untypedLetters = "";
        }
      }
    }
  },
  mounted: async function() {
    // Get random topic from example list to display on page load
    const exampleTopic =
      exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    const returnObject = await callAPI(exampleTopic);
    this.saveNewText(returnObject.extract);
    document.querySelector("#searchInput").placeholder =
      'e.g. "' + exampleTopic + '"';
    this.getNextWord();
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
