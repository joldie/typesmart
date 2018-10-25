<template>
  <div class="target-text-wrapper">
    {{text}}
  </div>
</template>

<script>
export default {
  name: "TargetText",
  props: {
    text: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.target-text-wrapper {
  width: 100%;
  max-width: 500px;
  height: 100%;
  max-height: 300px;
  border: 1px solid black;
  margin: 5px;
  padding: 5px;
}
</style>
