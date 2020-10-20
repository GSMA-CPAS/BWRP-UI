<template>
  <fragment>
    <app-dialog
      v-if="active"
      outlined
      title="Upload Service Data"
      label="upload data"
    >
      <template #content>
        <file-uploader
          @file-upload="(file) => loadFile(file)"
          file-types=".xlsx"
        />
      </template>
      <template #actions="{ cancel }">
        <v-spacer />
        <app-button text label="Cancel" @button-pressed="cancel" />
        <app-button
          @button-pressed="
            active = false;
            cancel();
          "
          label="Confirm"
          :disabled="_.isNil(file)"
        />
      </template>
    </app-dialog>
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>
<script>
// import { mapActions } from "vuex";
// import XLSX from "xlsx";
export default {
  name: "upload-settlement",
  description: "description",
  data() {
    return { file: null, active: true };
  },
  components: {},
  props: { actionButtonProps: Object },
  methods: {
    // ...mapActions("document/edit", ["uploadFile"]),
    loadFile(file) {
      this.file = file;
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