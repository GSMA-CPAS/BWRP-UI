import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {CONFIG} from '@/utils/Enums';

// INFO: register your APIs here
const core = axios.create({baseURL: CONFIG.coreBaseUrl});
const commonAdapter = axios.create({baseURL: CONFIG.commonAdapterBaseURL});
const local = axios.create({baseURL: CONFIG.localApiBaseUrl});

const apis = {core, commonAdapter, local};

Vue.use(VueAxios, apis);
