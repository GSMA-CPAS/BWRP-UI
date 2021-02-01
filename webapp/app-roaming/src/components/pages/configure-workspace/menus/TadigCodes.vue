<template>
  <div>
    <v-row class="mr-3 mb-1">
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
                onConfirm();
                cancel();
              "
              label="Confirm"
            />
          </template>
        </app-dialog>
      </v-col>
    </v-row>
    <v-card class="mr-5">
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
          <dialog-popup
            title="Delete Group"
            @on-confirm="deleteCode(item.id)"
            :icon="icons.remove"
          >
            <template #content> Are you sure? </template>
          </dialog-popup>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import {duplicateMixin} from '@/utils/mixins/component-specfic';
import {mapActions, mapState} from 'vuex';
import DialogPopup from './tadig-groups/DialogPopup.vue';
export default {
  name: 'tadig-codes',
  description: 'Codes',
  mixins: [duplicateMixin],
  data: () => ({code: null, search: ''}),
  components: {
    DialogPopup,
  },
  props: {},
  watch: {},
  methods: {
    async onConfirm() {
      await this.addCode(this.code);
      this.code = null;
    },
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
        {text: 'Code', value: 'code'},
        {text: 'Operator', value: 'operator'},
        {text: 'Country', value: 'country'},
        {text: 'Region', value: 'region'},
        {text: 'Group', value: 'op_group'},
        {text: 'MCC/MNC', value: 'mcc_mnc'},
        {text: 'Actions', value: 'actions', sortable: false, align: 'end'},
      ];
    },
  },
  mounted() {
    this.loadCodes();
  },
};
</script>
