import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { CONFIG } from "../utils/Enums";

Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = CONFIG.apiBaseURL;
