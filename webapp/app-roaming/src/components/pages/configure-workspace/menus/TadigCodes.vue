<template>
  <v-data-table :items="codes" :headers="headers">
    <template v-slot:top>
      <v-row>
        <v-col align-self="center" class="text-end">
          <app-dialog label="Add Code" title="New Code" outlined svg="plus">
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
    </template>
  </v-data-table>
</template>
<script>
import {mapActions, mapState} from 'vuex';
export default {
  name: 'tadig-codes',
  description: 'Codes',
  mixins: [],
  data: () => ({code: null}),
  components: {},
  props: {},
  watch: {},
  methods: {
    ...mapActions('workspace-config/tadig-codes', ['loadCodes', 'addCode']),
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', ['codes']),
    headers() {
      return [
        {text: 'ID', value: 'id'},
        {text: 'Code', value: 'code'},
      ];
    },
  },
  mounted() {
    this.loadCodes();
  },
};
</script>
