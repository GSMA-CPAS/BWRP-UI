<template>
  <app-dialog
    @on-open="loadPartners"
    title="NEW CONTRACT"
    label="create contract"
  >
    <template #content>
      <loading-spinner :isLoading="loadingSpinner" />
      <div v-show="!loadingSpinner">
        <v-row>
          <v-select
            v-model="partner"
            filled
            label="Select Business Partner"
            :items="partners"
          />
        </v-row>
        <v-row>
          <file-uploader
            ref="file-uploader"
            @on-delete="
              $refs['file-uploader'].fileRecords = [];
              fileAsJSON = null;
            "
            @file-upload="saveFile"
            file-types=".json"
          />
        </v-row>
      </div>
    </template>
    <template #actions="{cancel}">
      <app-button
        plain
        label="Cancel"
        @button-pressed="
          resetData();
          $refs['file-uploader'].fileRecords = [];
          cancel();
        "
      />
      <app-button
        :disabled="partnerSelected"
        label="Confirm"
        @button-pressed="confirm"
      />
    </template>
  </app-dialog>
</template>
<script>
import {dataMixin} from '@/utils/mixins/handle-data';
import {PATHS} from '@/utils/Enums';
import {timelineMixin} from '@/utils/mixins/component-specfic';
import {mapState} from 'vuex';
import LoadingSpinner from '../other/LoadingSpinner.vue';
import {mapActions} from 'vuex';

export default {
  components: {LoadingSpinner},
  name: 'create-contract',
  description: 'This is the dialog view when creating a new contract.',
  data: () => ({partner: null, fileAsJSON: null}),
  computed: {
    ...mapState('app-state', ['loadingSpinner']),
    ...mapState(['partners']),
    partnerSelected() {
      return this.partner === null;
    },
    path() {
      return PATHS.createContract;
    },
  },
  mixins: [dataMixin, timelineMixin],
  methods: {
    ...mapActions(['loadPartners']),
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
