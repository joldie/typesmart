<template>
  <div class="typed-text-wrapper">
    <p class="typed-text"></p>
  </div>
</template>

<script>
export default {
  name: "TypedText"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.typed-text-wrapper {
  width: 100%;
  max-width: 500px;
  height: 100%;
  max-height: 100px;
  border: 1px solid black;
  margin: 5px;
}
</style>
