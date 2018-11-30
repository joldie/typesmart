<template>
  <div class="speed-display">
    <div class="speed-colour-circle">
      <div class="speed-circle-mask1" v-bind:style="backgroundStyle">
        <div class="speed-circle-mask2">
          <span class="speed-text">{{speed}}</span>
          <span class="small-speed-text">wpm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpeedDisplay",
  props: {
    speed: Number
  },
  computed: {
    backgroundStyle: function() {
      const speedFraction = Math.min(this.speed / 150, 1);
      const angle = 180 * speedFraction;

      return `background-image: linear-gradient(${angle}deg, transparent 50%, white 50%), linear-gradient(0deg, white 50%, transparent 50%);!important;`;
    }
  }
};
</script>

<style scoped lang="scss">
.speed-display {
  align-self: center;
  justify-self: center;
  width: 120px;
  height: 60px;
  overflow: hidden;
}

.speed-colour-circle {
  position: relative;
  top: 5px;
  left: 5px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.speed-colour-circle:before {
  box-sizing: border-box;
  transform: scale(1);
  -webkit-filter: blur(20px) saturate(1.1) brightness(1.1);
  filter: blur(20px) saturate(1.1) brightness(1.1);
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  top: -50%;
  left: -50%;
  padding-top: 100%;
  background-image: linear-gradient(330deg, transparent 50%, green 50%),
    linear-gradient(300deg, transparent 50%, green 50%),
    linear-gradient(270deg, transparent 50%, red 50%),
    linear-gradient(240deg, transparent 50%, red 50%),
    linear-gradient(210deg, transparent 50%, red 50%),
    linear-gradient(180deg, transparent 50%, red 50%),
    linear-gradient(150deg, transparent 50%, #ff8100 50%),
    linear-gradient(120deg, transparent 50%, #feac00 50%),
    linear-gradient(90deg, transparent 50%, #ede604 50%),
    linear-gradient(60deg, transparent 50%, #9ed110 50%),
    linear-gradient(30deg, transparent 50%, #50b517 50%),
    linear-gradient(0deg, transparent 50%, green 50%);
  background-clip: content-box, content-box, content-box, content-box,
    content-box, content-box, padding-box, padding-box, padding-box, padding-box,
    padding-box, padding-box;
}

.speed-circle-mask1 {
  position: relative;
  left: 2px;
  top: 2px;
  width: 106px;
  height: 106px;
  border-radius: 50%;
}

.speed-circle-mask2 {
  position: relative;
  left: 13px;
  top: 13px;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
}
.speed-text {
  position: relative;
  top: 7px;
  text-align: center;
  font-size: 22px;
}
.small-speed-text {
  position: absolute;
  top: 30px;
  left: 55px;
  font-size: 8px;
  color: grey;
}
</style>
