<template>
  <!-- Override default form submit behaviour to avoid CORS issue during API call -->
  <form onSubmit="return false">  
    <input
      ref="input"
      type="text"
      required=true >
      <div class="wrapper-buttons">
        <button class="search-button" @click="searchClicked">
          Search
        </button>
        <button class="random-button" @click.prevent="randomClicked">
          Random topic
        </button>
        <button class="show-settings-button" @click.prevent="$emit('show-settings')">
          <font-awesome-icon icon="cog"></font-awesome-icon>
        </button>
      </div>
  </form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    apiUrl: String
  },
  methods: {
    // API call to Wikipedia which returns a JSON object about the given topic
    callAPI: async function(searchText) {
      let URL;
      if (searchText === "random") {
        // Get random topic
        URL = this.apiUrl + "random/summary";
      } else {
        // Get a specific topic with title = searchText
        URL = this.apiUrl + "summary/" + searchText;
      }
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
          if (searchText === "random") {
            // Update search input placeholder with name of random topic
            this.setPlaceholder('e.g. "' + returnObject.title + '"');
          }
        }
      }
    },
    // Search for new text based on user input
    searchClicked: function() {
      this.getNewText(this.$refs.input.value);
    },
    // Get text from a random topic
    randomClicked: function() {
      this.getNewText("random");
    },
    // Set placeholder text of input field
    setPlaceholder: function(text) {
      this.$refs.input.placeholder = text;
    }
  }
};
</script>

<style scoped lang="scss">
form {
  width: 100%;
  max-width: 300px;
  margin-bottom: 30px;
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 10px;
  text-align: center;
  input {
    width: 100%;
    font-size: 16px;
    height: 32px;
    text-align: center;
  }
  .search-button {
    width: 100px;
    margin-right: 10px;
  }
  button {
    height: 32px;
    font-size: 16px;
  }
}
@media screen and (max-width: 500px) {
  form {
    margin-bottom: 20px;
    grid-template-columns: auto auto auto;
    grid-column-gap: 5px;
    input {
      font-size: 14px;
      width: 175px;
    }
    .search-button {
      font-size: 14px;
      width: 70px;
      margin-right: 0;
    }
    .show-settings-button {
      font-size: 14px;
    }
  }
}
</style>
