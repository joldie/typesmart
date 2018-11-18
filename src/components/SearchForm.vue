<template>
  <div class="search-wrapper">
    <!-- Override default form submit behaviour to avoid CORS issue during API call -->
    <form onSubmit="return false">
      <div class="wrapper-other-buttons">
        <button class="random-button"
          @click.prevent="randomClicked"
          :disabled=!enableRandomButton >
          <font-awesome-icon icon="random"></font-awesome-icon>
          <span class="button-text"> Random</span>
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
    apiUrl: String,
    allTopics: Array,
    enableRandomButton: Boolean
  },
  methods: {
    // API call to Wikipedia which returns a summary about a topic
    getTopicWikiSummary: async function(topicTitle) {
      const response = await fetch(this.apiUrl + "summary/" + topicTitle);
      const jsonData = await response.json();
      return jsonData;
    },
    // Retrieve and check text from Wikipedia
    getNewText: async function(topicName) {
      // If topic name not given, get random topic from list of all vital articles
      if (topicName === "") {
        topicName = this.allTopics[
          Math.floor(Math.random() * this.allTopics.length)
        ].name;
      }

      // Perform API call to get summary text of random topic
      const returnObject = await this.getTopicWikiSummary(topicName);

      // Pass extract (summary) to parent for processing
      this.$emit("save-new-text", returnObject.extract);

      // If available, save link to thumbnail image
      if (typeof returnObject.thumbnail != "undefined") {
        this.$refs.thumbnail.src = returnObject.thumbnail.source;
        this.$refs.thumbnail.alt = returnObject.title;
      } else {
        this.$refs.thumbnail.src = "";
        this.$refs.thumbnail.alt = "";
      }
    },
    // Get text from a random topic
    randomClicked: function() {
      this.getNewText("");
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
    max-width: 320px;
    text-align: center;
    button {
      height: 32px;
      font-size: 16px;
    }
    .search-label {
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      margin: 5px;
      margin-bottom: 10px;
    }
    .wrapper-search-input {
      display: flex;
      input {
        height: 32px;
        margin-bottom: 5px;
        margin-right: 5px;
        font-size: 16px;
        text-align: center;
      }
    }
    .wrapper-other-buttons {
      display: flex;
      justify-content: space-between;
    }
  }
  .thumbnail-wrapper {
    width: 120px;
    max-height: 120px;
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
    width: 300px;
    margin-bottom: 15px;
    .search-label {
      display: none;
    }
    form {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto;
      .wrapper-search-input {
        input {
          width: 180px;
          font-size: 14px;
          margin: 0;
        }
      }
      button {
        font-size: 14px;
        padding-left: 4px;
        padding-right: 4px;
      }
      .button-text {
        display: none;
      }
    }
    .thumbnail-wrapper {
      display: none;
    }
  }
}
</style>
