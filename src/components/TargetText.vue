<template>
  <div class="target-text-wrapper">
    <img ref="thumbnail" src>
    <span class="green-highlight">{{text1}}</span>
    <span class="green-highlight underline">{{text2}}</span>
    <span class="red-highlight underline">{{text3}}</span>
    <span class="underline">{{text4WithoutSpacesOneEnd}}</span>
    <span>{{spacesOnEnd}}</span>
    <span>{{text5}}</span>
  </div>
</template>

<script>
export default {
  name: "TargetText",
  props: {
    text1: String,
    text2: String,
    text3: String,
    text4: String,
    text5: String
  },
  computed: {
    // Remove space characters from text4 prop so that they are not styled with underline
    text4WithoutSpacesOneEnd: function() {
      return this.text4[this.text4.length - 1] === " "
        ? this.text4.substring(0, this.text4.length - 1)
        : this.text4;
    },
    // Display space character from text4 prop separately (without styling)
    spacesOnEnd: function() {
      return this.text4[this.text4.length - 1] === " " ? " " : "";
    }
  },
  methods: {
    saveNewThumbnail: function(url, altText) {
      this.$refs.thumbnail.src = url;
      this.$refs.thumbnail.alt = altText;
    }
  }
};
</script>

<style scoped lang="scss">
.target-text-wrapper {
  width: 100%;
  min-height: 150px;
  border: 1px solid black;
  padding: 5px;
  font-size: 20px;
  text-align: justify;
  img {
    float: right;
    vertical-align: top;
    max-width: 150px;
    max-height: 150px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.green-highlight {
  color: #99cc0f;
}
.red-highlight {
  color: #983333;
  background: #d08383;
}
.underline {
  text-decoration: underline;
}
@media screen and (max-width: 500px) {
  img {
    display: none;
  }
}
</style>
