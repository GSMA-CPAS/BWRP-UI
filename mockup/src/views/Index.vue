<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col v-for="(link, key) in links" offset="1" :key="key" xs="6" sm="4" md="2">
        <v-card class="pa-5" width="250">
          <v-card-actions class="text-center justify-center">
            <router-link :to="link.path">{{ link.text }}</router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { PATHS } from "../utils/Enums";
import { ALL_VIEWS } from "./all-views";

export default {
  name: "index-page",
  description: "Navigation Page",
  path: PATHS.index,
  data: () => ({
    links: ALL_VIEWS.filter((view) => view.path !== PATHS.index).map(
      (view) => ({
        path: view.path,
        text: view.description,
      })
    ),
  }),
};
</script>

<style>
</style>
