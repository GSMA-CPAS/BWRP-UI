<template>
  <v-app-bar color="black" dark height="100" elevation="0" clipped-left app>
    <div class="logo" @click="clickLogo">
      <img src="@/assets/images/company-logo.svg" alt="" height="38px"/>
    </div>
    <v-spacer/>
    <v-btn v-if="isAdmin" text to="/settings/users">
      Settings
    </v-btn>
    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          {{ username }} ({{ mspid }})
          <v-icon>{{ $vuetify.icons.values.menuDown }}</v-icon>
        </v-btn>
      </template>
      <v-list min-width="200px">
        <v-list-item to="/account/security">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.account }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.logout }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>

export default {

  data: () => ({
    mspid: '',
    username: '',
    isAdmin: false,
  }),

  mounted() {
    this.$store.dispatch('appContext').then((response) => {
      const appContext = response;
      this.mspid = appContext.organization.mspid;
      this.username = appContext.user.username;
      this.isAdmin = appContext.user.isAdmin;
    }, (error) => {
      this.$modal.error(error);
    });
  },

  methods: {

    logout() {
      this.$http({method: 'post', url: '/api/v1/auth/logout', withCredentials: true}).then((/* response */) => {
        localStorage.removeItem('appContext');
        this.$router.push('/login');
      }).catch((error) => {
        this.$modal.error(error);
      });
    },

    clickLogo() {
      // catch -> handling NavigationDuplicated error
      this.$router.push('/').catch(() => {
      });
    },
  },
};

</script>

<style scoped>

.logo {
  cursor: pointer;
}

</style>
