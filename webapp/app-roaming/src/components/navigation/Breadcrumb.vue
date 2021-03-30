<template>
  <v-app-bar clipped-left app>
    <v-col class="pl-0">
      <v-breadcrumbs large :items="items"></v-breadcrumbs>
    </v-col>
    <!-- <v-col align-self="center" class="text-center" cols="2">
      <v-menu offset-y rounded="lg">
        <template v-slot:activator="{on, attrs}">
          <app-button svg="dots-vertical" icon v-bind="attrs" v-on="on" />
        </template>
        <v-list>
          <v-list-item
            v-for="({action, icon, title}, i) in options"
            @click="action"
            :key="i"
          >
            <v-list-item-icon right>
              <v-icon v-text="`mdi-${icon}`" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col> -->

    <v-col cols="4" class="text-end pr-0">
      <app-button
        v-if="refreshActive"
        icon-size="20"
        label="Refresh"
        svg="refresh"
        outlined
        color="black"
        @button-pressed="refreshPage"
      />

      <app-button
        class="ml-1"
        label="Workspace"
        :to="toWorkspace"
        outlined
        color="black"
        icon-size="20"
        svg="cog-outline"
      />
    </v-col>
  </v-app-bar>
</template>

<script>
import {PATHS} from '@/utils/Enums';
export default {
  name: 'breadcrumb',
  data: () => ({
    items: [
      {
        text: 'Contracts',
        to: PATHS.contracts,
      },
    ],
  }),
  methods: {
    refreshPage() {
      switch (this.$route.name) {
        case 'timeline-page':
          this.$store.dispatch('document/loadData', this.$route.params.cid);
          break;
        case 'contracts-overview':
          this.$store.dispatch('loadDocuments');
          break;
        default:
          break;
      }
    },
    addBreadcrumb(text, to) {
      this.items.push({text, to});
    },
    removeLastBreacrumb() {
      this.isHome && this.items.pop();
    },
  },
  computed: {
    options() {
      const options = [
        {
          action: this.redirectToWorkspace,
          title: 'Configure Workspace',
          icon: 'cog-outline',
          show: true,
        },
      ];

      this.refreshActive &&
        options.push({
          action: this.refreshPage,
          title: 'Refresh Page',
          icon: 'refresh',
        });
      return options;
    },
    refreshActive() {
      let active = false;
      switch (this.$route.name) {
        case 'timeline-page':
          active = true;
          break;
        case 'contracts-overview':
          active = true;
          break;
        default:
          break;
      }
      return active;
    },
    toWorkspace() {
      return PATHS.editWorkspace;
    },
    isHome() {
      return this.items.length > 1;
    },
  },
  watch: {
    $route(to, from) {
      const {name, meta, /*  params, */ path} = to;
      if (name === 'contracts-overview') {
        this.removeLastBreacrumb();
      }
      if (name === 'configure-workspace') {
        this.removeLastBreacrumb();
        this.addBreadcrumb(meta.text, path);
      } else if (from.name === 'contracts-overview') {
        to.name === 'timeline-page'
          ? this.addBreadcrumb(to.query.d, path)
          : this.addBreadcrumb(meta.text, path);
      }
    },
  },
  beforeMount() {
    const {name, meta, path, params} = this.$route;
    if (name === 'timeline-page') {
      this.addBreadcrumb(params.cid, path);
    } else {
      name !== 'contracts-overview' && this.addBreadcrumb(meta.text, path);
    }
  },
};
</script>
<style>
.v-toolbar .v-toolbar__content {
  padding: 4px 12px !important;
}
</style>
