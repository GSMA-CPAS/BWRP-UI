<template>
  <fragment>
    <app-dialog v-if="active" title="Upload Service Data" label="upload data">
      <template #content>
        <file-uploader @file-upload="file=> loadFile(file)" file-types=".xlsx" />
      </template>
      <template #actions="{cancel}">
        <v-spacer />
        <app-button text label="Cancel" @button-pressed="cancel" />
        <app-button
          @button-pressed="active = false;onUpload();"
          label="Confirm"
        />
      </template>
    </app-dialog>
    <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>
<script>
// import { mapActions } from "vuex";
// import XLSX from "xlsx";
import {timelineMixin} from "@/utils/mixins/component-specfic";
import AppDialog from "@/components/global-components/Dialog";

export default {
  name: "upload-usage-report",
  description: "description",
  data() {
    return { file: null, active: true };
  },
  mixins:[timelineMixin],
  components: {AppDialog},
  props: { actionButtonProps: Object },
  methods: {
    // ...mapActions("contract/edit", ["uploadFile"]),
    loadFile(file) {
      this.file = file;
    },
    async onUpload(){
      await this.onUsageReportUploaded();
    },
    convertFile() {
      //   var reader = new FileReader();
      //   reader.readAsArrayBuffer(this.file);
      //   reader.onload = (e) => {
      //     var data = new Uint8Array(e.target.result);
      //     var workbook = XLSX.read(data, { type: "array" });
      //     let sheetName = workbook.SheetNames[0];
      //     let worksheet = workbook.Sheets[sheetName];
      //     this.uploadFile(XLSX.utils.sheet_to_json(worksheet));
      //   };
    },
  },
};
</script>