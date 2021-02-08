<template>
  <div>
    <v-row class="mb-1">
      <v-col align-self="center" class="text--disabled">CODES</v-col>
      <v-col align-self="center" class="text-end pr-0">
        <app-dialog label="Add Code" title="New Code">
          <template #content>
            <v-row>
              <v-col>
                <v-text-field v-model="code" label="New Code" />
              </v-col>
              <v-col>
                <v-text-field v-model="operator" label="Operator" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="country" label="Country" />
              </v-col>
              <v-col>
                <v-text-field v-model="region" label="Region" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="op_group" label="Group" />
              </v-col>
              <v-col>
                <v-text-field v-model="mcc_mnc" label="MCC/MNC" />
              </v-col>
            </v-row>
          </template>
          <template #actions="{cancel}">
            <app-button
              :disabled="
                code === null ||
                operator === null ||
                country === null ||
                region === null ||
                op_group === null ||
                mcc_mnc === null
              "
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
  data: () => ({
    code: null,
    operator: null,
    country: null,
    region: null,
    op_group: null,
    mcc_mnc: null,
    search: '',
  }),
  components: {
    DialogPopup,
  },
  props: {},
  watch: {},
  methods: {
    async onConfirm() {
      await this.addCode({
        code: this.code,
        operator: this.operator,
        country: this.country,
        region: this.region,
        op_group: this.op_group,
        mcc_mnc: this.mcc_mnc,
      });
      this.code = null;
      this.operator = null;
      this.country = null;
      this.region = null;
      this.op_group = null;
      this.mcc_mnc = null;
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
