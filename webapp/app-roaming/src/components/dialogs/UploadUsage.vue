<template>
  <div>
    <app-dialog
      v-if="active"
      outlined
      title="Upload Service Data"
      label="upload data"
    >
      <template #content>
        <file-uploader
          @file-upload="(file) => loadFile(file)"
          file-types=".xlsx,.csv"
        />
      </template>
      <template #actions="{cancel}">
        <v-spacer />
        <app-button plain label="Cancel" @button-pressed="cancel" />
        <app-button
          @button-pressed="
            onUpload();
            active = false;
          "
          label="Confirm"
          :disabled="_.isNil(file)"
        />
      </template>
    </app-dialog>
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
  </div>
</template>
<script >
/*
  INFO: SUBJECT to changes
 */
import * as XLSX from 'xlsx';
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'upload-usage',
  description: 'description',
  data() {
    return {
      file: null,
      active: true,
      usageJson: {
        inbound: [],
        outbound: [],
      },
    };
  },
  components: {},
  mixins: [timelineMixin],
  props: {actionButtonProps: Object},
  methods: {
    loadFile(file) {
      const fr = new FileReader();
      fr.readAsBinaryString(file);
      this.file = file;
      fr.onload = (e) => {
        if (file.type === 'text/csv') {
          this.csvToJSON(e.target.result, this.usageJson);
        } else {
          const data = e.target.result;
          const workbook = XLSX.read(data, {type: 'binary'});
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawJson = XLSX.utils.sheet_to_row_object_array(worksheet);
          this.parseJson(rawJson, this.usageJson);
        }
      };
    },
    onUpload() {
      this.uploadUsage(this.usageJson);
    },
  },
};
</script>
