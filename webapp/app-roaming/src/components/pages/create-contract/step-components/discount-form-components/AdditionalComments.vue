<template>
  <v-textarea
    v-model="comments"
    placeholder="Comments"
    rows="2"
    auto-grow
    hint="Contract Details Not Listed Above"
  />
</template>
<script>
export default {
  name: 'additional-comments',
  data() {
    return {comments: null};
  },
};
</script>
