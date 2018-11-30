<template>
  <div id="app">
    <div class="app-wrapper">
      <header>
        <h1>TypeSmart</h1>
        <div class="subtitle-text">
          <p>Practice typing while learning &zwnj;</p>
          <vue-swimlane
            class="emphasised-title-text"
            :words="learnTopics"
            :transitionDelay="3000"
            :transitionDuration="1000"
            :scale="0.62"
            :circular="true"
          ></vue-swimlane>
        </div>
      </header>
      <SearchForm
        ref="searchForm"
        :apiUrl="searchApiUrl"
        :allTopics="allTopics"
        :enableRandomButton="(this.allTopics.length > 0)"
        @save-new-text="saveNewText"
        @show-settings="showSettings = true"
      />
      <div class="timer-text-wrapper">
        <TestControl
          ref="testControl"
          :running="timerRunning"
          :timeLimit="timeLimit"
          :speed="typingSpeed"
          @change-timer-state="changeTimerState"
          @timer-ended="timerEnded"
          @reset-test="resetTest"
          @one-second-elapsed="updateTime"
        />
        <TargetText
          :text1="completedWords"
          :text2="correctLetters"
          :text3="incorrectLetters"
          :text4="untypedLetters"
          :text5="remainingText"
        />
        <TypedText
          ref="typedText"
          :inputEnabled="timerRunning"
          v-bind:class="{ 'red-highlight': wrongInput }"
          @key-pressed="keyPressed"
        />
        <TimerDisplay
          :running="timerRunning"
          :secondsLeft="timerSecondsLeft"
          :timeLimit="timeLimit"
        />
      </div>
    </div>
    <SettingsModal
      v-show="showSettings"
      @close="showSettings = false"
      @time-limit-selected="timeLimitSelected"
      @max-words-selected="maxWordsSelected"
    />
  </div>
</template>

<script>
// Custom components
import SearchForm from "./components/SearchForm.vue";
import SettingsModal from "./components/SettingsModal.vue";
import TestControl from "./components/TestControl.vue";
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";
import TimerDisplay from "./components/TimerDisplay.vue";

// Examples for showing a topic on page load, before waiting for API call to complete
const exampleTopics = [
  "Fyodor Dostoevsky",
  "Mahatma Gandhi",
  "Marie Curie",
  "Scramble for Africa",
  "Mecca",
  "Great Barrier Reef",
  "Angkor Wat",
  "Confucianism",
  "Shia Islam",
  "Sexual orientation",
  "Soybean",
  "Fascism",
  "Women's suffrage",
  "Mental disorder",
  "Supernova",
  "Eukaryote",
  "Standard Model",
  "Cryptography"
];

export default {
  name: "app",
  components: {
    SearchForm,
    SettingsModal,
    TestControl,
    TargetText,
    TypedText,
    TimerDisplay
  },
  data: function() {
    return {
      targetText: "",
      completedWords: "",
      correctLetters: "",
      incorrectLetters: "",
      untypedLetters: "",
      remainingText: "",
      nextWord: "",
      typingSpeed: 0,
      timerRunning: false,
      timerSecondsLeft: 120,
      showSettings: false,
      searchApiUrl: "https://en.wikipedia.org/api/rest_v1/page/",
      maxWords: 30,
      timeLimit: 120,
      learnTopics: ["history", "a language", "science", "geography"],
      allTopics: []
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
      // Replace all new line characters with space
      originalText = originalText.replace("\n", " ");
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
      // Set focus to start/stop button for quick test start
      this.$refs.testControl.focus();
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
          this.$refs.testControl.startStop();
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
    updateTime: function(secondsElapsed) {
      // Update timer remaining, then update current speed value
      this.timerSecondsLeft--;

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
        this.typingSpeed = 0;
      }
    },
    // Reset test fields
    resetTest: function() {
      this.timerRunning = false;
      this.timerSecondsLeft = this.timeLimit;
      this.saveNewText(this.targetText);
      this.typingSpeed = 0;
      this.$refs.testControl.focus();
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
    timerEnded: function() {
      this.timerRunning = false;
      alert("Time up, test finished!");
    },
    // Save selected word limit from Settings component
    maxWordsSelected: function(wordLimit) {
      this.maxWords = Number(wordLimit);
    },
    // Save selected time limit from Settings component
    timeLimitSelected: function(timeLimit) {
      this.timeLimit = Number(timeLimit);
    },
    // API call to wikipedia-vital-aticles API running on local Express server
    getAllArticles: async function() {
      const response = await fetch("http://localhost:3000");
      const jsonData = await response.json();
      return jsonData;
    }
  },
  mounted: async function() {
    // Get random topic from example list to display on page load
    const exampleTopic =
      exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    this.$refs.searchForm.getNewText(exampleTopic);
    this.$refs.testControl.focus();
    // Retrieve list of all of Wikipedia's ~1000 "vital articles"
    this.allTopics = await this.getAllArticles();
  }
};
</script>

<style lang="scss">
@import "../css/normalize.css";

* {
  box-sizing: border-box;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
html,
body {
  width: 100%;
  min-width: 320px;
  height: 100%;
  font-family: sans-serif;
  color: black;
}
#app {
  width: 100%;
  height: 100%;
}
.app-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
header {
  text-align: center;
  margin-bottom: 30px;
  .subtitle-text {
    display: grid;
    grid-template-columns: auto auto;
    font-size: 18px;
    font-weight: bold;
    p {
      margin: 0;
      padding-top: 2px;
    }
    .emphasised-title-text li {
      background: #feac00;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
.timer-text-wrapper {
  width: 100%;
  max-width: 600px;
  padding-bottom: 10px;
  margin-bottom: 30px;
  display: grid;
  grid-template-rows: auto auto auto;
  grid-row-gap: 15px;
}
@media screen and (max-width: 500px) {
  header {
    h1 {
      font-size: 22px;
      margin: 10px;
    }
    .subtitle-text {
      display: none;
    }
    margin-bottom: 10px;
  }
  .timer-text-wrapper {
    grid-row-gap: 10px;
  }
}
</style>
