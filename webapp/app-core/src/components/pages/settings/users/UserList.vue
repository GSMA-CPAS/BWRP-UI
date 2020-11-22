<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn tile color="primary" to="/settings/users/create">Create User</v-btn>
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
            <v-data-table @click:row="handleClickItem"
                          :headers="headers"
                          :items="items"
                          :search="search"
            ></v-data-table>
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
        sortable: true,
        value: 'active',
        width: '1%',
      },
      {
        text: 'Admin',
        align: 'left',
        sortable: true,
        value: 'isAdmin',
        width: '1%',
      },
    ],
  }),

  created: function() {
    setTimeout(() => {
      this.fetchUsers();
    }, 1000);
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
