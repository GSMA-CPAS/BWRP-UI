<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          DASHBOARD
        </v-col>
        <v-col cols="12">
          <div v-if="appSize > 0" class="grid">
            <div v-for="app in apps" :key="app.name" @click="loadApp(app)">
              {{ app.displayName }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/Layout';

export default {

  name: 'ContractList',
  title: 'Dashboard',

  data: () => ({
    loading: true,
    showDashboard: false,
    apps: {},
    appSize: 0,
    currentApp: {},
  }),

  created: function() {
    setTimeout(() => {
      this.init();
    }, 200);
  },

  methods: {

    init() {
      this.$http({method: 'get', url: '/api/v1/apps', withCredentials: true}).then((response) => {
        this.appSize = response.data.appSize;
        this.apps = response.data.apps;
        if (this.appSize === 1) {
          this.$router.push('/a/' + Object.keys(this.apps)[0]);
        } else if (this.appSize > 1) {
          this.loading = false;
        } else {
          this.$modal.error({message: 'No app configured!'});
          this.loading = false;
        }
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },

    loadApp(app) {
      this.$router.push('/a/' + app.name);
    },
  },

  components: {
    Layout,
  },
};

</script>

<style scoped>

.grid {
  margin: 0;
  padding: 20px;
  background-color: #e3fafc;
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(200px, auto);
}

.grid > div {
  background-color: #99e9f2;
  color: #000;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.grid > div:hover {
  border-style: solid;
  border-color: #000000;
}

</style>
