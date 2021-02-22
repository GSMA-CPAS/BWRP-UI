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
      <template #actions="{cancel}">
        <v-spacer />
        <app-button plain label="Cancel" @button-pressed="cancel" />
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
/*
  INFO: SUBJECT to changes
 */
export default {
  name: 'upload-settlement',
  description: 'description',
  data() {
    return {file: null, active: true};
  },
  components: {},
  props: {actionButtonProps: Object},
  methods: {
    loadFile(file) {
      this.file = file;
    },
  },
};
</script>
