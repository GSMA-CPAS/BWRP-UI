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
            <v-form ref="formCreateUser" v-model="valid" lazy-validation @submit.prevent="createUser">
              <v-card-text>
                <v-text-field v-model="newUser.username" label="Username"
                              :rules="[rules.required, rules.username, rules.min(newUser.username, 3)]"></v-text-field>
                <v-text-field v-model="newUser.password" label="Password"
                              :rules="[rules.required, rules.password]"></v-text-field>
                <v-text-field v-model="newUser.forename" label="First name"></v-text-field>
                <v-text-field v-model="newUser.surname" label="Last name"></v-text-field>
                <v-text-field v-model="newUser.email" label="E-Mail" :rules="[rules.email]"></v-text-field>
                <!-- <v-checkbox v-model="newUser.canSignDocument" label="Can sign documents"></v-checkbox>-->
                <v-checkbox v-model="newUser.isAdmin" label="Administrator"></v-checkbox>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn type="submit" color="primary" tile>Create User</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutSettings';
import {validationRules} from '@/utils/ValidationRules';

export default {

  name: 'UserCreate',
  title: 'Create User',

  data: () => ({
    loading: false,
    breadcrumbItems: [
      {
        text: 'Users'.toUpperCase(),
        disabled: false,
        exact: true,
        to: '/settings/users',
      },
      {
        text: 'Create'.toUpperCase(),
        disabled: true,
      },
    ],
    newUser: {
      username: '',
      password: '',
      forename: '',
      surname: '',
      email: '',
      canSignDocument: false,
      isAdmin: false
    },
    valid: true,
    rules: validationRules
  }),

  methods: {

    createUser() {
      if (this.$refs.formCreateUser.validate()) {
        this.loading = true;
        this.$http({
          method: 'post',
          url: '/api/v1/users',
          withCredentials: true,
          data: this.newUser,
        }).then((/* response */) => {
          this.loading = false;
          this.$router.push('/settings/users');
          /* this.$modal.info({
            title: 'Success',
            message: 'User "' + this.newUser.username + '" has been created successfully!',
            callbackOk: () => {
              this.$router.push('/settings/users');
            },
          });*/
        }).catch((error) => {
          this.loading = false;
          this.$modal.error(error);
        });
      }
    },
  },

  components: {
    Layout,
  },
};

</script>
