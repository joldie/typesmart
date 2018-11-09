<template>
  <div class="search-wrapper">
    <!-- Override default form submit behaviour to avoid CORS issue during API call -->
    <form onSubmit="return false">  
      <input
        ref="input"
        type="text"
        required=true />
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
    <div class="thumbnail-wrapper">
      <img
      ref="thumbnail"
      class="thumbnail-image"
      src="" />
    </div>
  </div>
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
          // If available, save link to thumbnail image
          if (typeof returnObject.thumbnail != "undefined") {
            this.$refs.thumbnail.src = returnObject.thumbnail.source;
            this.$refs.thumbnail.alt = returnObject.title;
          }
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
.search-wrapper {
  border: 1px solid rgb(184, 184, 184);
  padding: 5px;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 10px;
  margin-bottom: 30px;
  form {
    width: 100%;
    max-width: 300px;
    text-align: center;
    input {
      width: 100%;
      height: 32px;
      margin-bottom: 5px;
      font-size: 16px;
      text-align: center;
    }
    .wrapper-buttons {
      display: flex;
      justify-content: space-between;
      button {
        height: 32px;
        font-size: 16px;
      }
      .search-button {
        width: 100px;
      }
      button {
        height: 32px;
        //font-size: 16px;
      }
    }
  }
  .thumbnail-wrapper {
    width: 150px;
    max-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    .thumbnail-image {
      max-width: 100%;
      max-height: 100%;
    }
  }
}

@media screen and (max-width: 500px) {
  .search-wrapper {
    width: 100%;
    margin-bottom: 20px;
    grid-template-columns: auto;
    justify-items: center;
    form {
      grid-template-columns: auto auto auto;
      grid-column-gap: 5px;
      input {
        font-size: 14px;
      }
      .search-button {
        font-size: 14px;
      }
      .show-settings-button {
        font-size: 14px;
      }
    }
    .thumbnail-wrapper {
      display: none;
    }
  }
}
</style>
