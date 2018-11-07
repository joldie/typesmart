import Vue from "vue";
import Swimlane from "vue-swimlane";
import App from "./App.vue";

// Font Awesome imports and setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHourglassHalf,
  faPlay,
  faPause,
  faUndo,
  faCog,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faHourglassHalf, faPlay, faPause, faUndo, faCog, faTimes);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Swimlane library for displaying scrolling text
Vue.use(Swimlane);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
