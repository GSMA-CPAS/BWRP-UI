<template>
  <app-dialog title="new contract" label="create contract">
    <template #content>
      <v-row>
        <v-select v-model="partner" filled label="Select Business Partner" :items="list" />
      </v-row>
      <v-row>
        <file-uploader @file-upload="saveFile" file-types=".json" />
      </v-row>
    </template>
    <template #actions="{ cancel }">
      <app-button text label="Cancel" @button-pressed="resetData();cancel();" />
      <app-button :disabled="partnerSelected" label="Confirm" @button-pressed="confirm" />
    </template>
  </app-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { dataMixin } from "../../utils/mixins/handle-data";
import { PATHS } from "../../utils/Enums";

export default {
  name: "create-contract",
  description: "This is the dialog to create a contract.",
  props: {},
  data: () => ({ partner: null, fileAsJSON: null }),
  computed: {
    ...mapGetters("partners", ["list"]),
    partnerSelected() {
      return this.partner === null;
    },
    path() {
      return PATHS.createContract;
    },
  },
  mixins: [dataMixin],
  methods: {
    ...mapActions("contract/new", ["startContract"]),
    confirm() {
      this.startContract({
        partner: this.partner,
        fileAsJSON: this.fileAsJSON,
      });
      this.$router.push(this.path);
    },
    saveFile(file) {
      const fr = new FileReader();
      fr.readAsText(file);
      fr.onload = (e) => {
        const result = JSON.parse(e.target.result);
        this.fileAsJSON = result;
      };
    },
  },
};
</script>