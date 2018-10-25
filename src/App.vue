<template>
  <div id="app">
    <h1>Typing Test</h1>
    <form onSubmit="return false">
      <input id="searchInput" type="text" placeholder='e.g. "jaguar"'>
      <button v-on:click="getNewText">Get text</button>
    </form>
    <TargetText :text=targetText />
    <TypedText />
  </div>
</template>

<script>
import TargetText from "./components/TargetText.vue";
import TypedText from "./components/TypedText.vue";

export default {
  name: "app",
  components: {
    TargetText,
    TypedText
  },
  data: function() {
    return {
      targetText: "Placeholder text"
    };
  },
  methods: {
    getNewText: async function() {
      const URL =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        document.querySelector("#searchInput").value;
      const response = await fetch(URL);
      const jsonData = await response.json();
      this.targetText = jsonData.extract;
      // Possible return values:
      // 1) Full abstract text
      // 2) Redirect "... may refer to: ..."
      // 3) Undefined
    }
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
