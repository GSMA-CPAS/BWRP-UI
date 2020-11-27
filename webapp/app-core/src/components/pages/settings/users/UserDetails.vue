<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <breadcrumbs :items="breadcrumbItems" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              User Details
            </v-card-title>
            <v-form ref="formUpdateUser" v-model="valid" lazy-validation @submit.prevent="updateUser">
              <v-card-text>
                <v-text-field v-model="user.username" color="secondary" disabled></v-text-field>
                <v-text-field v-model="user.forename" label="First name" color="secondary"></v-text-field>
                <v-text-field v-model="user.surname" label="Last name" color="secondary"></v-text-field>
                <v-text-field v-model="user.email" label="E-Mail" color="secondary"
                              :rules="[rules.email]"></v-text-field>
                <v-checkbox v-model="user.active" label="Active"></v-checkbox>
                <v-checkbox v-model="user.isAdmin" label="Administrator"></v-checkbox>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn type="submit" color="primary" tile>Update User</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              User Certificate
            </v-card-title>
            <v-card-actions class="pa-4">
              <v-btn color="primary" tile @click="showCertificateDialog = true">Show certificate</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              Enroll User
            </v-card-title>
            <v-card-text>
              Enroll registered user to create new signed certificate
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn color="primary" tile @click="enroll">Enroll user</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              Reset Password
            </v-card-title>
            <v-form ref="formResetPassword" v-model="valid" lazy-validation @submit.prevent="resetPassword">
              <v-card-text>
                <v-text-field v-model="newPasswordReset" label="New Password" color="secondary"
                              :rules="[rules.required, rules.password]"></v-text-field>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn type="submit" color="primary" tile>Reset password</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showCertificateDialog" persistent width="640">
      <v-card>
        <v-card-title class="headline">Certificate</v-card-title>
        <v-card-text>
          <span v-html="certificateHtml"></span>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="primary" tile @click="showCertificateDialog = false">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutSettings';
import {validationRules} from '@/utils/ValidationRules';
import breadcrumbs from '../../../navigation/Breadcrumbs';

export default {

  name: 'UserDetails',
  title: 'User Details',
  data: () => ({
    loading: true,
    breadcrumbItems: [
      {
        text: 'Users'.toUpperCase(),
        disabled: false,
        exact: true,
        to: '/settings/users',
      },
      {
        text: 'Details'.toUpperCase(),
        disabled: true,
      },
    ],
    userId: null,
    user: {
      username: '',
      forename: '',
      surname: '',
      email: '',
      active: false,
      isAdmin: false,
    },
    certificateData: {
      notBefore: '',
      notAfter: '',
      issuer: {},
      subject: {},
      attributes: {},
    },
    certificateHtml: '',
    newPasswordReset: '',
    showCertificateDialog: false,
    valid: true,
    rules: validationRules,
  }),

  created: function() {
    this.userId = this.$route.params.id;
    setTimeout(() => {
      this.fetchUser();
    }, 100);
  },

  methods: {

    fetchUser() {
      this.$http({method: 'get', url: '/api/v1/users/' + this.userId, withCredentials: true}).then((response) => {
        this.loading = false;
        this.user = response.data;
        if (this.user.certificate) {
          this.certificateHtml = this.user.certificate.replace(/(?:\r\n|\r|\n)/g, '<br/>');
          /* if (this.user.certificateData) {
            console.log(this.user.certificateData);
          }*/
        } else {
          this.$modal.error({message: 'Failed to load user certificate'});
        }
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },

    updateUser() {
      if (this.$refs.formUpdateUser.validate()) {
        const data = {
          forename: this.user.forename,
          surname: this.user.surname,
          email: this.user.email,
          active: this.user.active,
          isAdmin: this.user.isAdmin
        };
        this.loading = true;
        this.$http({
          method: 'put',
          url: '/api/v1/users/' + this.user.id,
          withCredentials: true,
          data: data,
        }).then(() => {
          this.loading = false;
          this.$modal.info({
            title: 'Success',
            message: 'User "' + this.user.username + '" has been updated successfully!',
          });
        }).catch((error) => {
          this.loading = false;
          this.$modal.error(error);
        });
      }
    },

    showCertificate() {
      this.$modal.info({message: 'info'});
    },

    resetPassword() {
      if (this.$refs.formResetPassword.validate()) {
        const data = {
          userId: this.user.id,
          newPassword: this.newPasswordReset,
        };
        this.$modal.confirm({
          title: 'Reset Password', message: 'Are you sure?',
          callbackOk: () => {
            this.loading = true;
            this.$http({
              method: 'post',
              url: '/api/v1/users/password/reset',
              withCredentials: true,
              data: data,
            }).then((/* response */) => {
              this.loading = false;
              this.newPasswordReset = '';
              this.$modal.info({
                title: 'Success',
                message: 'User password has been reset successfully!',
              });
            }).catch((error) => {
              this.loading = false;
              this.$modal.error(error);
            });
          },
        });
      }
    },

    enroll() {
      this.$modal.confirm({
        title: 'Enroll user', message: 'Are you sure?',
        callbackOk: () => {
          this.loading = true;
          this.$http({
            method: 'post',
            url: '/api/v1/users/enroll',
            withCredentials: true,
            data: {enrollmentId: this.user.username},
          }).then((/* response */) => {
            this.fetchUser();
            this.$modal.info({
              title: 'Success',
              message: 'User has been enrolled successfully!',
            });
          }).catch((error) => {
            this.loading = false;
            this.$modal.error(error);
          });
        },
      });
    },
  },

  components: {
    Layout,
    breadcrumbs
  },
};

</script>
