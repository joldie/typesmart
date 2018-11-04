import Vue from "vue";
import App from "./App.vue";

// Font Awesome imports and setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStopwatch,
  faPlay,
  faPause,
  faUndo,
  faCog,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faStopwatch, faPlay, faPause, faUndo, faCog, faTimes);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
