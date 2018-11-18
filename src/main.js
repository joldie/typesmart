import Vue from "vue";
import App from "./App.vue";

// Font Awesome imports and setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHourglassHalf,
  faPlay,
  faPause,
  faUndo,
  faCog,
  faTimes,
  faRandom,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faHourglassHalf,
  faPlay,
  faPause,
  faUndo,
  faCog,
  faTimes,
  faRandom,
  faSearch
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Plugin for displaying scrolling text
import Swimlane from "vue-swimlane";
Vue.use(Swimlane);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
