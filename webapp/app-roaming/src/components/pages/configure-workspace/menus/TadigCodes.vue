<template>
  <div>
    <v-row>
      <v-col align-self="center" class="text--disabled">CODES</v-col>
      <v-col align-self="center" class="text-end">
        <app-dialog label="Add Code" title="New Code">
          <template #content>
            <v-text-field v-model="code" label="New Code"></v-text-field>
          </template>
          <template #actions="{cancel}">
            <app-button
              :disabled="code === null"
              @button-pressed="
                addCode(code);
                cancel();
              "
              label="Confirm"
            />
          </template>
        </app-dialog>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table :search="search" :items="codes" :headers="headers">
        <template v-slot:[`item.actions`]="{item}">
          <v-icon small @click="deleteCode(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex';
export default {
  name: 'tadig-codes',
  description: 'Codes',
  mixins: [],
  data: () => ({code: null, search: ''}),
  components: {},
  props: {},
  watch: {},
  methods: {
    ...mapActions('workspace-config/tadig-codes', [
      'loadCodes',
      'addCode',
      'deleteCode',
    ]),
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', ['codes']),
    headers() {
      return [
        {text: 'ID', value: 'id'},
        {text: 'Code', value: 'code'},
        {text: 'Actions', value: 'actions', sortable: false, align: 'end'},
      ];
    },
  },
  mounted() {
    this.loadCodes();
  },
};
</script>
