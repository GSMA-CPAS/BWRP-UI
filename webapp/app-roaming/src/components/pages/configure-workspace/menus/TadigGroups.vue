<template>
  <div>
    <v-row>
      <v-col align-self="center" class="text--disabled">GROUPS</v-col>
      <v-col align-self="center" class="text-end">
        <app-dialog label="Add Group" title="New Group">
          <template #content>
            <v-text-field v-model="group" label="New Group"></v-text-field>
          </template>
          <template #actions="{cancel}">
            <app-button
              @button-pressed="
                addGroup(group);
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
      <v-data-table :search="search" :items="groups" :headers="headers">
        <template v-slot:[`item.actions`]="{item}">
          <dialog-popup
            title="Add"
            @on-confirm="addCodes({id: item.id, codes: codesToBeAdded})"
            :icon="icons.add"
          >
            <template #content>
              <v-select
                multiple
                label="All Available Codes"
                :items="allCodes"
                item-value="id"
                item-text="code"
                v-model="codesToBeAdded"
              />
            </template>
          </dialog-popup>
          <dialog-popup
            title="Remove"
            @on-open="loadGroupCodes(item.id)"
            @on-confirm="removeCodes({id: item.id, codes: codesToBeRemoved})"
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
            @on-open="loadGroupCodes(item.id)"
            title="All Codes of Group"
            :icon="icons.view"
          >
            <template #content>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="({code}, i) in groupCodes" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="code"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </dialog-popup>
          <tooltip tooltip-text="Delete Group">
            <template v-slot:activator="{on}">
              <v-icon v-on="on" @click="deleteGroup(item.id)" small>
                mdi-delete
              </v-icon>
            </template>
          </tooltip>
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
    headers() {
      return [
        {text: 'ID', value: 'id'},
        {text: 'Name', value: 'name'},
        {text: 'Actions', value: 'actions', sortable: false, align: 'end'},
      ];
    },
  },
  mounted() {
    this.loadGroups();
  },
};
</script>
