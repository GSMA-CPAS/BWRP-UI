
<template>
    <v-data-table :items="documents" :headers="headers" :search="search">
    <template v-slot:top>
      <v-row class="mb-2">
        <!-- <v-col>
          <filters :onClear="clearFilters"> </filters>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search for document"
            single-line
            hide-details
          />
        </v-col>
      </v-row>
    </template>
    <template #item="{item}">
      <tr
        @click="to(item.contractId + '?d=' + item.referenceId)"
        @keypress.enter="to(item.contractId + '?d=' + item.referenceId)"
        tabindex="0"
      >
        <td class="pa-6">
          {{
            `${item.referenceId.substring(0, 5)}...${item.referenceId.substring(
              item.referenceId.length - 5,
              item.referenceId.length,
            )}`
          }}
        </td>
        <td>{{ item.partnerMsp }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.authors }}</td>
        <td>{{ item.lastModification }}</td>
        <td>{{ item.startDate }}</td>
        <td>{{ item.endDate }}</td>
        <td>{{ item.state }}</td>
        <!-- <td @click.stop>
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
              <v-list-item
                link
                v-for="(item, i) in items"
                @click="item.action"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon
                    v-text="`mdi-${item.icon}`"
                    :color="item.iconColor"
                  ></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </td> -->
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import {mapState} from 'vuex';
// import Filters from '@/components/other/Filters.vue';
export default {
  name: 'contracts-table',
  description: 'In this table, the documents are displayed.',
  data() {
    return {
      search: '',
    };
  },
  components: {
    // Filters,
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
    onSummary() {
      console.log('Pressed Summary');
    },
    onUpload() {
      console.log('Pressed Upload');
    },
    onEdit() {
      console.log('Pressed Edit');
    },
    onDelete() {
      console.log('Pressed Delete');
    },
  },
  computed: {
    headers() {
      return [
        {text: 'Reference ID', value: 'referenceId'},
        {text: 'Partner', value: 'partnerMsp'},
        {text: 'Name', value: 'contractName'},
        {text: 'Author', value: 'author'},
        {text: 'Last Modification', value: 'lastModification'},
        {text: 'Start Date', value: 'startDate'},
        {text: 'End Date', value: 'endDate'},
        {text: 'State', value: 'state'},
        // {text: 'Actions', value: 'action'},
        // {text: 'To MSP', value: 'partnerMsp'},
      ];
    },
    items() {
      return [
        {title: 'Summary', icon: 'clipboard-text', action: this.onSummary},
        {title: 'Upload Usage Report', icon: 'upload', action: this.onUpload},
        {
          title: 'Edit',
          icon: 'pencil',
          action: this.onEdit,
        },
        {
          title: 'Delete',
          icon: 'delete',
          action: this.onDelete,
        },
      ];
    },
    ...mapState(['documents']),
  },
};
</script>
