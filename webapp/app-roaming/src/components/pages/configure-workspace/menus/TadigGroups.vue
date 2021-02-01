<template>
  <div>
    <v-row class="mr-3 mb-1">
      <v-col align-self="center" class="text--disabled">GROUPS</v-col>
      <v-col align-self="center" class="text-end">
        <app-dialog label="Add Group" title="New Group">
          <template #content>
            <v-text-field v-model="group" label="New Group"></v-text-field>
          </template>
          <template #actions="{cancel}">
            <app-button
              :disabled="group === null"
              @button-pressed="
                onAddGroup();
                cancel();
              "
              label="Confirm"
            />
          </template>
        </app-dialog>
      </v-col>
    </v-row>

    <v-card class="mr-6">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :search="search"
        :items="groups"
        item-key="name"
        :headers="headers"
        single-expand
        show-expand
      >
        <template #item="{item, expand, isExpanded}">
          <tr
            tabindex="0"
            @click.stop="
              expand(!isExpanded);
              loadGroupCodes(item.id);
            "
          >
            <td>{{ item.name }}</td>
            <td class="text-end">
              <dialog-popup
                title="Add Codes"
                @on-open="loadGroupCodes(item.id)"
                :disabled="codesToBeAdded === null"
                @on-confirm="onCodesAdded(item.id)"
                :icon="icons.add"
              >
                <template #content>
                  <v-select
                    multiple
                    label="All Available Codes"
                    :items="allCodesMinusGroupCodes"
                    item-value="id"
                    item-text="code"
                    v-model="codesToBeAdded"
                  />
                </template>
              </dialog-popup>
              <dialog-popup
                title="Remove Codes"
                @on-open="loadGroupCodes(item.id)"
                :disabled="codesToBeRemoved === null"
                @on-confirm="onCodesRemoval(item.id)"
                :icon="icons.minus"
                margin="mr-4"
              >
                <template #content>
                  <v-select
                    multiple
                    label="Codes of Group"
                    :items="groupCodes"
                    item-value="tadig_code_id"
                    item-text="code"
                    v-model="codesToBeRemoved"
                  />
                </template>
              </dialog-popup>
              <dialog-popup
                title="Delete Group"
                @on-confirm="deleteGroup(item.id)"
                :icon="icons.remove"
              >
                <template #content> Are you sure? </template>
              </dialog-popup>
            </td>
            <td colspan="headers.length">
              <v-icon>
                {{ `mdi-chevron-${!isExpanded ? 'down' : 'up'}` }}</v-icon
              >
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="{}">
          <td :colspan="headers.length">
            <v-container>
              <v-data-table
                v-if="groupCodes.length > 0"
                :headers="groupHeaders"
                :items="groupCodes"
                hide-default-footer
              />
              <v-row v-else class="font-italic"><v-col>No Codes</v-col></v-row>
            </v-container>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex';
import DialogPopup from './tadig-groups/DialogPopup.vue';
import {duplicateMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'tadig-groups',
  description: 'Groups',
  mixins: [duplicateMixin],
  data: () => ({
    group: null,
    codesToBeAdded: null,
    codesToBeRemoved: null,
    search: '',
  }),
  components: {DialogPopup},
  props: {},
  watch: {},
  methods: {
    onAddGroup() {
      this.addGroup(this.group);
      this.group = null;
    },
    onCodesAdded(groupid) {
      this.addCodes({id: groupid, codes: this.codesToBeAdded});
      this.codesToBeAdded = null;
    },
    onCodesRemoval(groupid) {
      this.removeCodes({id: groupid, codes: this.codesToBeRemoved});
      this.codesToBeRemoved = null;
    },
    ...mapActions('workspace-config/tadig-groups', [
      'loadGroups',
      'addGroup',
      'deleteGroup',
      'addCodes',
      'loadGroupCodes',
      'removeCodes',
    ]),
    ...mapActions('workspace-config/tadig-codes', ['loadCodes']),
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', {
      allCodes: (state) => state.codes,
    }),
    ...mapState('workspace-config/tadig-groups', ['groups', 'groupCodes']),
    allCodesMinusGroupCodes() {
      const filteredCodes = this.allCodes.map((code) => ({
        disabled: this.groupCodes
          .map(({tadig_code_id: id}) => id)
          .includes(code.id),
        ...code,
      }));
      return filteredCodes;
    },
    headers() {
      return [
        {text: 'Name', value: 'name'},
        {text: 'Actions', value: 'actions', sortable: false, align: 'end'},
        {text: '', value: 'data-table-expand'},
      ];
    },
    groupHeaders() {
      return [
        {text: 'Code', value: 'code'},
        {text: 'Operator', value: 'operator'},
        {text: 'Country', value: 'country'},
        {text: 'Region', value: 'region'},
        {text: 'Group', value: 'op_group'},
        {text: 'MCC/MNC', value: 'mcc_mnc'},
      ];
    },
  },
  mounted() {
    this.loadGroups();
  },
};
</script>
