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
            <v-form ref="formCreateIdentity" v-model="valid" lazy-validation @submit.prevent="createIdentity">
              <v-card-text>
                <v-text-field v-model="newIdentity.name" label="Name"
                              :rules="[rules.required, rules.identityName]"></v-text-field>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn type="submit" color="primary" tile>Create Identity</v-btn>
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

  name: 'UserIdentity',
  title: 'Create Identity',

  data: () => ({
    loading: false,
    breadcrumbItems: [
      {
        text: 'Signing Identities'.toUpperCase(),
        disabled: false,
        exact: true,
        to: '/settings/identities',
      },
      {
        text: 'Create'.toUpperCase(),
        disabled: true,
      },
    ],
    newIdentity: {
      name: ''
    },
    valid: true,
    rules: validationRules
  }),

  methods: {

    createIdentity() {
      if (this.$refs.formCreateIdentity.validate()) {
        this.loading = true;
        this.$http({
          method: 'post',
          url: '/api/v1/identities',
          withCredentials: true,
          data: this.newIdentity,
        }).then((/* response */) => {
          this.loading = false;
          this.$router.push('/settings/identities');
          /* this.$modal.info({
            title: 'Success',
            message: 'Identity has been created successfully!',
            callbackOk: () => {
              this.$router.push('/settings/identities');
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
