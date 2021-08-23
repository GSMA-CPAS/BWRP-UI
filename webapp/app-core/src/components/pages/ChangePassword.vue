<template>
  <layout :navbar=false>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-6">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Change Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Please enter new password. New password must be at least 8 characters long.
          </v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="changePassword" :disabled="isFormDisabled">
            <v-card-text>
              <v-text-field type="password" v-model="password" label="Password" :rules="[rules.required]"
                            autofocus></v-text-field>
              <v-text-field type="password" v-model="newPassword" label="New password"
                            :rules="[rules.required, rules.password]"></v-text-field>
              <v-text-field type="password" v-model="confirmNewPassword" label="Confirm new password"
                            :rules="[rules.required, rules.password]"></v-text-field>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn type="submit" color="primary" tile block large :loading="loading">Change password</v-btn>
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

  name: 'ChangePassword',
  title: 'Change Password',

  data: () => ({
    loading: false,
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    valid: true,
    rules: validationRules,
    isFormDisabled: false
  }),

  methods: {

    changePassword() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.isFormDisabled = true;
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
          this.isFormDisabled = false;
          localStorage.removeItem('appContext');
          this.$router.push('/login');
        }).catch((error) => {
          this.loading = false;
          this.isFormDisabled = false;
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
