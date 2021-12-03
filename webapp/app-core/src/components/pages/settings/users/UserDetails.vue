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
            <v-card-title>
              User Details
            </v-card-title>
            <v-form ref="formUpdateUser" v-model="valid" lazy-validation @submit.prevent="updateUser">
              <v-card-text>
                <v-text-field v-model="user.username" color="secondary" disabled></v-text-field>
                <v-text-field v-model="user.forename" label="First name" color="secondary"></v-text-field>
                <v-text-field v-model="user.surname" label="Last name" color="secondary"></v-text-field>
                <v-text-field v-model="user.email" label="E-Mail" color="secondary" :rules="[rules.email]"></v-text-field>
                <v-checkbox v-model="user.active" label="Active" v-if="loggedInUser !== user.username"></v-checkbox>
                <v-checkbox v-model="user.isAdmin" label="Administrator" v-if="loggedInUser !== user.username"></v-checkbox>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Update User</v-btn>
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
              Signing Identities
            </v-card-title>
            <v-card-text>
              <v-simple-table v-if="user.identities.length > 0">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in user.identities" :key="item.name">
                    <td class="text-left">{{item.name}} <span v-if="item.revoked" class="red--text">(REVOKED)</span></td>
                    <td class="text-right"><v-icon small @click="removeIdentity(item)">{{$vuetify.icons.values.trashCan}}</v-icon></td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div v-else>
                Here you can add one or more identities for signing
              </div>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openAddIdentityDialog">Add Identity</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row v-if="loggedInUser !== user.username">
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              Reset Password
            </v-card-title>
            <v-card-text>
              User password will be changed to the new password. User must change password after first login.
            </v-card-text>
            <v-form ref="formResetPassword" v-model="valid" lazy-validation @submit.prevent="resetPassword">
              <v-card-text>
                <v-text-field v-model="newPasswordReset" label="New Password" color="secondary"
                              :rules="[rules.required, rules.password]"></v-text-field>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Reset password</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row v-if="loggedInUser !== user.username">
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title>
              Delete User
            </v-card-title>
            <!--<v-card-text>
            </v-card-text>-->
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="deleteUser">Delete user</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showAddIdentityDialog" persistent width="640">
      <v-card>
        <v-card-title class="headline">Add Identity</v-card-title>
        <v-card-text>
          <v-combobox
              v-model="identitiesSelected"
              :items="identities"
              item-text="name"
              item-value="id"
              label="Select identities"
              multiple>
            <template v-slot:selection="{/* index,*/ item}">
              {{item.name}}
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn @click="showAddIdentityDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addIdentities">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutSettings';
import {validationRules} from '@/utils/ValidationRules';

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
    loggedInUser: null,
    userId: null,
    user: {
      username: '',
      forename: '',
      surname: '',
      email: '',
      active: false,
      isAdmin: false,
      identities: []
    },
    identities: [],
    myArray: [],
    identitiesSelected: [],
    newPasswordReset: '',
    showAddIdentityDialog: false,
    valid: true,
    rules: validationRules,
  }),

  created: function() {
    this.userId = this.$route.params.id;
    this.$store.dispatch('appContext').then((response) => {
      this.loggedInUser = response.user.username;
      setTimeout(() => {
        this.fetchUser();
      }, 200);
    }, (error) => {
      this.$modal.error(error);
    });
  },

  methods: {

    fetchUser() {
      this.$http({method: 'get', url: '/api/v1/users/' + this.userId, withCredentials: true}).then((response) => {
        this.loading = false;
        this.user = response.data;
        this.breadcrumbItems[1].text = this.user.username.toUpperCase();
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
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.$modal.info({
              title: 'Success',
              message: 'User "' + this.user.username + '" has been updated successfully!',
            });
          } else {
            this.$modal.error({
              message: 'Failed to update user "' + this.user.username + '"!',
            });
          }
        }).catch((error) => {
          this.loading = false;
          this.$modal.error(error);
        });
      }
    },

    resetPassword() {
      if (this.$refs.formResetPassword.validate()) {
        const data = {
          userId: this.user.id,
          newPassword: this.newPasswordReset,
        };
        this.$modal.confirm({
          title: 'Reset User Password', message: 'Are you sure?',
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

    deleteUser() {
      this.$modal.confirm({
        title: 'Delete user', message: 'Are you sure?',
        callbackOk: () => {
          this.loading = true;
          this.$http({
            method: 'delete',
            url: '/api/v1/users/' + this.userId,
            withCredentials: true
          }).then((/* response*/) => {
            this.$modal.info({
              title: 'Success',
              message: 'User has been deleted successfully!',
              callbackOk: () => {
                this.$router.push('/settings/users');
              }
            });
          }).catch((error) => {
            this.loading = false;
            this.$modal.error(error);
          });
        },
      });
    },

    openAddIdentityDialog() {
      this.identitiesSelected = [];
      this.$http({
        method: 'get',
        url: '/api/v1/identities',
        withCredentials: true
      }).then((response) => {
        this.loading = false;
        this.identities = response.data;
        this.identities = this.identities.map((identity) => ({
          disabled: this.user.identities.map(({id: id}) => id).includes(identity.id), ...identity
        }));
        this.showAddIdentityDialog = true;
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },

    addIdentities() {
      const identityIds = [];
      for (const identity of this.identitiesSelected) {
        identityIds.push(identity.id);
      }
      this.$http({
        method: 'post',
        url: '/api/v1/users/' + this.userId + '/identities',
        withCredentials: true,
        data: identityIds,
      }).then((/* response*/) => {
        this.loading = false;
        this.showAddIdentityDialog = false;
        /* this.$modal.info({
          title: 'Success',
          message: (identityIds.length > 1) ? 'Identities have been added successfully' : 'Identity has been added successfully',
        });*/
        for (const identity of this.identitiesSelected) {
          this.user.identities.push(identity);
        }
      }).catch((error) => {
        this.loading = false;
        this.showAddIdentityDialog = false;
        this.$modal.error(error);
      });
    },

    removeIdentity(item) {
      this.$modal.confirm({
        title: 'Remove Identity', message: 'Are you sure you want to remove identity "' + item.name + '"?',
        callbackOk: () => {
          this.loading = false;
          this.$http({
            method: 'delete',
            url: '/api/v1/users/' + this.userId + '/identities',
            withCredentials: true,
            data: [item.id],
          }).then((/* response*/) => {
            this.loading = false;
            const index = this.user.identities.indexOf(item);
            this.user.identities.splice(index, 1);
            /* this.$modal.info({
              title: 'Success',
              message: 'Identity has been removed successfully!',
            });*/
          }).catch((error) => {
            this.loading = false;
            this.$modal.error(error);
          });
        },
      });
    }
  },

  components: {
    Layout,
  },
};

</script>
