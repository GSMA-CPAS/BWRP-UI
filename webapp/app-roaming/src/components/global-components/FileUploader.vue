<template>
  <VueFileAgent
    v-model="fileRecords"
    style="width: 100%"
    @beforedelete="$emit('on-delete')"
    v-bind="$props"
    :accept="fileTypes"
    :errorText="{
      type: 'Invalid file type. Only ' + fileTypes + ' Allowed',
      size: 'Files should not exceed ' + maxSize + ' in size',
    }"
  />
</template>
<script>
export default {
  name: 'file-uploader',
  description: 'This is a custom file uploader.',
  data() {
    return {
      fileRecords: [],
    };
  },
  props: {
    fileTypes: {type: String},
    maxSize: {type: String, default: '10MB'},
    helpText: {
      type: String,
      default: 'Click to pick file or drag & drop here (optional)',
    },
    deletable: {type: Boolean, default: true},
    compact: {type: Boolean, default: false},
    theme: {type: String, default: 'list'},
    multiple: {type: Boolean, default: false},
  },
  watch: {
    fileRecords(input) {
      // const file =  ? input[0].file : null;
      input.length > 0 && this.$emit('file-upload', input[0].file);
    },
  },
};
</script>
