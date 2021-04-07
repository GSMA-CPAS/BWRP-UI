<template>
  <div>
    <v-row class="mb-1">
      <v-col align-self="center" class="text--disabled">GROUPS</v-col>
      <v-col align-self="center" class="text-end pr-0">
        <app-dialog label="Add Group" title="New Group">
          <template #content>
            <v-text-field v-model="groupName" label="New Group" />
          </template>
          <template #actions="{cancel}">
            <app-button @button-pressed="cancel" label="Cancel" plain />
            <app-button
              :disabled="groupName === null"
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
                @on-open="
                  loadGroupCodes(item.id);
                  codesToBeAdded = null;
                "
                :disabled="codesToBeAdded === null"
                @on-confirm="onCodesAdded(item.id)"
                :icon="icons.add"
              >
                <template #content>
                  <v-combobox
                    @change="removeSearchTerm"
                    multiple
                    label="All Available Codes"
                    :items="allCodesMinusGroupCodes"
                    :search-input.sync="groupCodeSearchTerm"
                    item-value="id"
                    item-text="code"
                    v-model="codesToBeAdded"
                  />
                </template>
              </dialog-popup>
              <dialog-popup
                title="Remove Codes"
                @on-open="
                  loadGroupCodes(item.id);
                  codesToBeRemoved = null;
                "
                :disabled="codesToBeRemoved === null"
                @on-confirm="onCodesRemoval(item.id)"
                :icon="icons.minus"
                margin="mr-4"
              >
                <template #content>
                  <v-combobox
                    @change="removeSearchTerm"
                    multiple
                    label="Codes of Group"
                    :items="groupCodes"
                    :search-input.sync="groupCodeRemovalSearchTerm"
                    item-value="tadig_code_id"
                    item-text="code"
                    v-model="codesToBeRemoved"
                  />
                </template>
              </dialog-popup>
              <dialog-popup
                title="Edit Group"
                @on-open="groupName = item.name"
                @on-confirm="
                  editGroup({id: item.id, groupName});
                  groupName = null;
                "
                :icon="icons.edit"
              >
                <template #content>
                  <v-text-field v-model="groupName" label="New name" />
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
import {duplicateMixin} from '@mixins/component-specfic';
export default {
  name: 'tadig-groups',
  description: 'Groups',
  mixins: [duplicateMixin],
  data: () => ({
    groupName: null,
    codesToBeAdded: null,
    codesToBeRemoved: null,
    search: '',
    groupCodeSearchTerm: null,
    groupCodeRemovalSearchTerm: null,
  }),
  components: {DialogPopup},
  props: {},
  watch: {},
  methods: {
    removeSearchTerm(e) {
      this.groupCodeSearchTerm = null;
      this.groupCodeRemovalSearchTerm = null;
    },
    onAddGroup() {
      this.addGroup(this.groupName);
      this.groupName = null;
    },
    onCodesAdded(groupid) {
      const codes = this.codesToBeAdded.map(({id}) => id);
      this.addCodes({id: groupid, codes});
      this.codesToBeAdded = null;
    },
    onCodesRemoval(groupid) {
      const codes = this.codesToBeRemoved.map(
        // eslint-disable-next-line camelcase
        ({tadig_code_id}) => tadig_code_id,
      );
      this.removeCodes({id: groupid, codes});
      this.codesToBeRemoved = null;
    },
    ...mapActions('workspace-config/tadig-groups', [
      'loadGroups',
      'addGroup',
      'editGroup',
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
