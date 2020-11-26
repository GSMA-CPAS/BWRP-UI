<template>
  <layout :loading="loading" :appHeader=false>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-6">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Welcome Back</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
            <v-card-text>
              <v-text-field v-model="username" label="Username" color="secondary" :rules="[rules.required]"
                            autofocus></v-text-field>
              <v-text-field type="password" v-model="password" label="Password" color="secondary"
                            :rules="[rules.required]"></v-text-field>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn type="submit" color="primary" tile block large>Login</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutNoNavbar';
import {validationRules} from '@/utils/ValidationRules';

export default {

  name: 'Login',

  data: () => ({
    loading: false,
    username: '',
    password: '',
    valid: true,
    rules: validationRules,
  }),

  methods: {

    login() {
      if (this.$refs.form.validate()) {
        const data = {username: this.username, password: this.password};
        this.$http({
          method: 'post',
          url: '/api/v1/auth/login',
          data,
          withCredentials: true,
        }).then((response) => {
          if (response.data.twoFactor) {
            this.$router.push('/2fa');
          } else {
            if (response.data.mustChangePassword) {
              this.$router.push('/password/change');
            } else {
              localStorage.setItem('appContext', JSON.stringify(response.data.appContext));
              this.$router.push('/');
            }
          }
        }).catch(() => {
          this.$modal.error({message: 'Username or password is incorrect!'});
        });
      }
    },
  },

  components: {
    Layout,
  },
};

</script>
