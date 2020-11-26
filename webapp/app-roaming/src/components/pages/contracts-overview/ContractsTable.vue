
<template>
  <v-data-table :items="documents" :headers="headers" :search="search">
    <template v-slot:top>
      <v-row>
        <v-col>
          <filters :onClear="clearFilters"> </filters>
        </v-col>
        <v-col cols="5">
          <v-text-field
            outlined
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Contract"
            single-line
            hide-details
          />
        </v-col>
      </v-row>
    </template>
    <template #item="{item}">
      <tr
        @click="to(item.documentId)"
        @keypress.enter="to(item.documentId)"
        tabindex="0"
      >
        <td class="pa-6">
          {{
            `${item.documentId.substring(0, 5)}...${item.documentId.substring(
              item.documentId.length - 5,
              item.documentId.length,
            )}`
          }}
        </td>
        <td>someReferenceID</td>
        <td>someName</td>
        <td>someAuthor</td>
        <td>lastModification</td>
        <td>startDate</td>
        <td>endDate</td>
        <td>{{ item.state }}</td>
        <td @click.stop>
          <v-menu offset-y>
            <template v-slot:activator="{on, attrs}">
              <app-button
                v-bind="attrs"
                v-on="on"
                tile
                svg="dots-horizontal"
                icon
              />
            </template>
            <v-list>
              <v-list-item link v-for="(item, i) in items" :key="i">
                <v-list-item-title v-text="item.title" />
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import {mapState} from 'vuex';
import Filters from '@/components/other/Filters.vue';
export default {
  name: 'contracts-table',
  title: 'Contract List',
  description: 'In this table, the documents are displayed.',
  data() {
    return {
      search: '',
      headers: [
        {text: 'Document ID', value: 'documentId', align: 'start'},
        {text: 'Internal Reference', value: 'referenceID'},
        {text: 'Name', value: 'contractName'},
        {text: 'Author', value: 'author'},
        {text: 'Last Modification', value: 'lastModification'},
        {text: 'Start Date', value: 'startDate'},
        {text: 'End Date', value: 'endDate'},
        {text: 'State', value: 'state'},
        {text: 'Actions', value: 'action'},
        // {text: 'From MSP', value: 'fromMSP'},
        // {text: 'To MSP', value: 'toMSP'},
      ],
    };
  },
  components: {
    Filters,
  },
  methods: {
    clearFilters() {
      this.selectFilters.forEach((filter) => {
        filter.value = [];
      });
    },
    to(cid) {
      this.$router.push(`/contract-timeline/${cid}`);
    },
  },
  computed: {
    items() {
      return [{title: 'Summary'}, {title: 'Edit'}, {title: 'Delete'}];
    },
    ...mapState(['documents']),
  },
};
</script>
