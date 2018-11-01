<template>
  <!-- Override default form submit behaviour to avoid CORS issue during API call -->
  <form onSubmit="return false">  
    <input
      ref="input"
      type="text"
      :placeholder=placeholderText
      required=true >
    <button v-on:click="buttonClicked">Get new text</button>
  </form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    placeholderText: String,
    apiUrl: String
  },
  methods: {
    // API call to Wikipedia which returns a JSON object about the given topic
    callAPI: async function(searchText) {
      const URL = this.apiUrl + searchText;
      const response = await fetch(URL);
      const jsonData = await response.json();
      return jsonData;
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
          // If topic found, pass extract (summary) to parent for processing
          this.$emit("save-new-text", returnObject.extract);
        }
      }
    },
    // Search for new text based on user input
    buttonClicked: function() {
      this.getNewText(this.$refs.input.value);
    }
  }
};
</script>

<style scoped lang="scss">
form {
  margin: 5px;
}
</style>
