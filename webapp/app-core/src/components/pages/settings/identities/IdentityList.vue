<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn color="primary" to="/settings/identities/create">Create Identity</v-btn>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-text-field
                  v-model="search"
                  :append-icon="$vuetify.icons.values.search"
                  label="Search"
                  single-line
                  hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table @click:row="handleClickItem" :headers="headers" :items="items" :search="search">
              <template v-slot:item.actions="{item}">
                <v-icon small @click.stop="deleteIdentity(item)">
                  {{$vuetify.icons.values.trashCan}}
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutSettings';

export default {

  name: 'IdentityList',
  title: 'Identities',

  data: () => ({
    loading: true,
    breadcrumbItems: [
      {
        text: 'Signing Identities'.toUpperCase(),
        disabled: true,
      },
    ],
    search: '',
    items: [],
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'right',
        sortable: false
      }
    ],
  }),

  created: function() {
    setTimeout(() => {
      this.fetchIdentities();
    }, 200);
  },

  methods: {
    fetchIdentities() {
      this.$http({method: 'get', url: '/api/v1/identities', withCredentials: true}).then((response) => {
        this.items = response.data;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },

    handleClickItem(value) {
      this.$router.push('/settings/identities/' + value.id);
    },

    deleteIdentity(item) {
      this.$modal.confirm({
        title: 'Delete Identity', message: 'Are you sure you want to delete identity "' + item.name + '"?',
        callbackOk: () => {
          this.loading = false;
          this.$http({
            method: 'delete',
            url: '/api/v1/identities/' + item.id,
            withCredentials: true
          }).then((/* response*/) => {
            this.loading = false;
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            /* this.$modal.info({
              title: 'Success',
              message: 'Identity has been deleted successfully!',
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
    Layout
  }
};
</script>
