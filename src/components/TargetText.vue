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

<style scoped lang="scss">
.target-text-wrapper {
  width: 100%;
  max-width: 800px;
  border: 1px solid black;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
}
</style>
