<template>
  <VueFileAgent
    v-model="fileRecords"
    style="width:100%;"
    v-bind="$props"
    :accept="fileTypes"
    :errorText="{
      type: 'Invalid file type. Only ' + fileTypes + ' Allowed',
      size: 'Files should not exceed ' + maxSize + ' in size'
    }"
  />
</template>
<script>
export default {
  name: "file-uploader",
  description: "This is custom file uploader.",
  data() {
    return {
      fileRecords: [],
    };
  },
  props: {
    fileTypes: { type: String },
    maxSize: { type: String, default: "10MB" },
    helpText: {
      type: String,
      default: "Click to pick file or drag & drop here (optional)",
    },
    deletable: { type: Boolean, default: true },
    compact: { type: Boolean, default: false },
    theme: { type: String, default: "list" },
    multiple: { type: Boolean, default: false },
  },
  watch: {
    fileRecords(input) {
      const file = input.length > 0 ? input[0].file : null;
      this.$emit("file-upload", file);
    },
  },
};
</script>