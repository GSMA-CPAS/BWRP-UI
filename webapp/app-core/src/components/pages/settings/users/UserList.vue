<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn color="primary" to="/settings/users/create">Create User</v-btn>
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
              <template v-slot:[`item.active`]="{item}">
                {{ item.active ? 'true': 'false' }}
              </template>
              <template v-slot:[`item.isAdmin`]="{item}">
                {{ item.active ? 'true': 'false' }}
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

  name: 'UserList',
  title: 'Users',

  data: () => ({
    loading: true,
    breadcrumbItems: [
      {
        text: 'Users'.toUpperCase(),
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
        value: 'username',
      },
      {
        text: 'Forename',
        align: 'left',
        sortable: true,
        value: 'forename',
      },
      {
        text: 'Surname',
        align: 'left',
        sortable: true,
        value: 'surname',
      },
      {
        text: 'Active',
        align: 'left',
        sortable: false,
        value: 'active',
        width: '1%',
      },
      {
        text: 'Admin',
        align: 'left',
        sortable: false,
        value: 'isAdmin',
        width: '1%',
      },
    ],
  }),

  created: function() {
    setTimeout(() => {
      this.fetchUsers();
    }, 200);
  },

  methods: {
    fetchUsers() {
      this.$http({method: 'get', url: '/api/v1/users', withCredentials: true}).then((response) => {
        this.items = response.data;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },
    handleClickItem(value) {
      this.$router.push('/settings/users/' + value.id);
    },
  },

  components: {
    Layout
  }
};
</script>
