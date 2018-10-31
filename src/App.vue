<template>
  <div id="app">
    <h1>Typing Test</h1>
    <SearchForm
      :placeholderText=searchPlaceholder
      v-on:search-button-clicked="getNewText" />
    <Timer
      ref="timer"
      :running=timerRunning
      v-on:change-timer-state="changeTimerState"
      v-on:reset-test="resetTest" />
    <TargetText
      :text1=completedText
      :text2=correctLetters
      :text3=incorrectLetters
      :text4=untypedLetters
      :text5=remainingText />
    <TypedText
      ref="typedText"
      :inputEnabled=timerRunning
      v-bind:class="{ 'red-highlight': wrongInput }"
      v-on:key-pressed="keyPressed" />
  </div>
</template>

<script>
// Custom components
import SearchForm from "./components/SearchForm.vue";
import Timer from "./components/Timer.vue";
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";

// Examples for showing a random topic on page load
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

export default {
  name: "app",
  components: {
    SearchForm,
    Timer,
    TargetText,
    TypedText
  },
  data: function() {
    return {
      searchPlaceholder: "Hi",
      targetText: "",
      completedText: "",
      correctLetters: "",
      incorrectLetters: "",
      untypedLetters: "",
      remainingText: "",
      nextWord: "",
      timerRunning: false
    };
  },
  computed: {
    // Dictates whether red warnign colour is shown to user or not
    wrongInput: function() {
      return this.incorrectLetters.length > 0 ? true : false;
    }
  },
  methods: {
    // API call to Wikipedia which returns a JSON object about the given topic
    callAPI: async function(searchText) {
      const URL =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" + searchText;
      const response = await fetch(URL);
      const jsonData = await response.json();
      return jsonData;
    },
    // Reset text fields
    clearAllText: function() {
      this.completedText = "";
      this.correctLetters = "";
      this.incorrectLetters = "";
      this.untypedLetters = "";
      this.nextWord = "";
      this.$refs.typedText.clear();
    },
    // Retrieve and check text from Wikipedia
    getNewText: async function(searchText) {
      if (searchText.length !== 0) {
        // Perform API call to get summary text of topic
        const returnObject = await this.callAPI(searchText);
        // Check returned JSON object
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
    // Format and save text from API call
    saveNewText: function(originalText) {
      // Not a hard limit. Algorithm will stop adding sentences only after limit has first been exceeded.
      const maxWords = 10;
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
      this.clearAllText();
      this.remainingText = text.trim();
      this.targetText = text.trim();
    },
    // Returns count of number of sentences in a given text
    numSentences: function(text) {
      // Note: regex fails with words that include periods, e.g. "Vue.js is great."
      const sentenceRegex = /["',;-\s\w]+[.?!](\s|$)/g;
      return text.match(sentenceRegex);
    },
    // Returns count of number of words in a given text
    numWords: function(text) {
      const wordRegex = /\w+/g;
      return text.match(wordRegex).length;
    },
    // Get next word in text (denoted by space caharacter or end of text reached)
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
    // Handle keyboard event in typing input field
    keyPressed: function(typedText) {
      if (typedText === this.nextWord) {
        this.completedText += typedText;
        this.$refs.typedText.clear();
        if (this.remainingText.length === 0) {
          this.correctLetters = "";
          this.untypedLetters = "";
          this.$refs.timer.startStop();
          alert("Done!");
        } else {
          this.getNextWord();
        }
      } else {
        this.checkTypedLetters(typedText);
      }
    },
    // Check typed letter against expected letter in target text
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
    },
    // Reset test fields
    resetTest: function() {
      this.timerRunning = false;
      this.saveNewText(this.targetText);
      this.getNextWord();
    },
    // Update timer state
    changeTimerState: function(bool) {
      this.timerRunning = bool;
      // If timer starting, set focus to typing input field
      if (bool) {
        // Short timeout required to give DOM time to enable element before setting focus
        setTimeout(() => {
          this.$refs.typedText.focus();
        }, 10);
      }
    }
  },
  mounted: async function() {
    // Get random topic from example list to display on page load
    const exampleTopic =
      exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    const returnObject = await this.callAPI(exampleTopic);
    this.saveNewText(returnObject.extract);
    this.searchPlaceholder = 'e.g. "' + exampleTopic + '"';
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
</style>
