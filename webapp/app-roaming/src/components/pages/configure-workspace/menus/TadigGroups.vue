<template>
  <v-data-table :items="groups" :headers="headers">
    <template v-slot:top>
      <v-row>
        <v-col align-self="center" class="text-end">
          <app-dialog label="Add Group" title="New Group" outlined svg="plus">
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
    </template>
  </v-data-table>
</template>
<script>
import {mapActions, mapState} from 'vuex';
export default {
  name: 'tadig-groups',
  description: 'Groups',
  mixins: [],
  data: () => ({group: null}),
  components: {},
  props: {},
  watch: {},
  methods: {
    ...mapActions('workspace-config/tadig-groups', ['loadGroups', 'addGroup']),
  },
  computed: {
    ...mapState('workspace-config/tadig-groups', ['groups']),
    headers() {
      return [
        {text: 'ID', value: 'id'},
        {text: 'Name', value: 'name'},
      ];
    },
  },
  mounted() {
    this.loadGroups();
  },
};
</script>
