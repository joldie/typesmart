<template>
  <div id="app">
    <h1>Typing Test</h1>
    <span>
      {{typingSpeed}} wpm
    </span>
    <SearchForm
      ref="searchForm"
      :apiUrl=searchApiUrl
      :placeholderText=searchPlaceholder
      v-on:save-new-text="saveNewText" />
    <Settings
      v-on:new-language-selected="newLanguageSelected"
      v-on:max-words-selected="maxWordsSelected" />
    <Timer
      ref="timer"
      :running=timerRunning
      v-on:change-timer-state="changeTimerState"
      v-on:reset-test="resetTest"
      v-on:one-second-elapsed="updateTypingSpeed" />
    <TargetText
      :text1=completedWords
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
import Settings from "./components/Settings.vue";
import Timer from "./components/Timer.vue";
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";

// Examples for showing a random topic on page load
const exampleTopics = [
  "jaguar",
  "rock climbing",
  "Russian revolution",
  "Uganda",
  "Vue.js",
  "David Bowie",
  "Homage to Catalonia",
  "jupiter",
  "ecology"
];

export default {
  name: "app",
  components: {
    SearchForm,
    Settings,
    Timer,
    TargetText,
    TypedText
  },
  data: function() {
    return {
      searchPlaceholder: "",
      targetText: "",
      completedWords: "",
      correctLetters: "",
      incorrectLetters: "",
      untypedLetters: "",
      remainingText: "",
      nextWord: "",
      typingSpeed: "-",
      timerRunning: false,
      searchApiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
      maxWords: 10
    };
  },
  computed: {
    // Dictates whether red warning colour is shown to user or not
    wrongInput: function() {
      return this.incorrectLetters.length > 0 ? true : false;
    },
    // Returns number of correctly typed entries (characters and punctuation)
    correctEntriesTyped: function() {
      return this.completedWords.length + this.correctLetters.length;
    }
  },
  methods: {
    // Reset text fields
    clearAllText: function() {
      this.completedWords = "";
      this.correctLetters = "";
      this.incorrectLetters = "";
      this.untypedLetters = "";
      this.nextWord = "";
      this.$refs.typedText.clear();
    },
    // Format and save text from API call
    saveNewText: function(originalText) {
      // Split text into sentences and save in array
      const sentences = this.getAllSentences(originalText);
      // Add sentences to text until word limit has been reached.
      let text = "";
      let i = 0;
      do {
        text = text + sentences[i];
        i++;
      } while (this.numWords(text) < this.maxWords && i < sentences.length);
      // Trim any whitespace from end and update target text display
      this.clearAllText();
      this.remainingText = text.trim();
      this.targetText = text.trim();
      this.getNextWord();
    },
    // Returns array containing all sentences in a given text
    getAllSentences: function(text) {
      /* Regex explanation:
          .+?     1 or more of any character (except new-line), ungreedy
          [.?!]   Exactly 1 of these three characters: . ? !
          (\s|$)  Exactly 1 space or end of text */
      const regex = /.+?[.?!](\s|$)/g;
      return text.match(regex);
    },
    // Returns count of number of words in a given text
    numWords: function(text) {
      /* Regex explanation:
          (^|\s)  Exactly 1 space or start of text
          [^ ]+   1 or more of any character, excluding space */
      const regex = /(^|\s)[^ ]+/g;
      return text.match(regex) === null ? 0 : text.match(regex).length;
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
        this.completedWords += typedText;
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
    updateTypingSpeed: function(secondsElapsed) {
      /*  Formula for calculating words per minute, WPM:
            Gross WPM = (All typed entries / 5) / Time in minutes
          i.e. a "word" is considered to be any 5 characters to account for
          varying word lengths
      
      Note: - Errors are ignored, as they must be corrected in order to continue
              to the next word, unlike in some tests. */

      const correctEntriesTyped =
        this.completedWords.length + this.correctLetters.length;
      const speed = Math.floor(correctEntriesTyped / 5 / (secondsElapsed / 60));

      if (!isNaN(speed) && isFinite(speed)) {
        this.typingSpeed = speed;
      } else {
        this.typingSpeed = "-";
      }
    },
    // Reset test fields
    resetTest: function() {
      this.timerRunning = false;
      this.saveNewText(this.targetText);
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
    },
    // Save selected language from Settings component
    newLanguageSelected: function(URL) {
      this.searchApiUrl = URL;
    },
    // Save selected word limit from Settings component
    maxWordsSelected: function(wordLimit) {
      this.maxWords = wordLimit;
    }
  },
  mounted: async function() {
    // Get random topic from example list to display on page load
    const exampleTopic =
      exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    this.searchPlaceholder = 'e.g. "' + exampleTopic + '"';
    const returnObject = await this.$refs.searchForm.callAPI(exampleTopic);
    this.saveNewText(returnObject.extract);
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
