<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="changePassword">
              <v-card-text>
                <v-text-field type="password" v-model="password" label="Password" :rules="[rules.required]"
                              autofocus></v-text-field>
                <v-text-field type="password" v-model="newPassword" label="New password"
                              :rules="[rules.required, rules.password]"></v-text-field>
                <v-text-field type="password" v-model="confirmNewPassword" label="Confirm new password"
                              :rules="[rules.required, rules.password]"></v-text-field>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" tile>Change Password</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutAccount';
import {validationRules} from '@/utils/ValidationRules';

export default {

  name: 'Password',

  data: () => ({
    loading: false,
    breadcrumbItems: [
      {
        text: 'Security'.toUpperCase(),
        disabled: false,
        exact: true,
        to: '/account/security',
      },
      {
        text: 'Change Password'.toUpperCase(),
        disabled: true,
      },
    ],
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    valid: true,
    rules: validationRules,
  }),

  methods: {

    changePassword() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const data = {
          password: this.password,
          newPassword: this.newPassword,
          confirmNewPassword: this.confirmNewPassword,
        };
        this.$http({
          method: 'post',
          url: '/api/v1/users/password/change',
          data,
          withCredentials: true,
        }).then((/* response */) => {
          this.loading = false;
          localStorage.removeItem('appContext');
          this.$router.push('/login?show=login_again');
        }).catch((error) => {
          this.loading = false;
          this.$modal.error(error);
        });
      }
    },
  },

  components: {
    Layout
  }
};

</script>
