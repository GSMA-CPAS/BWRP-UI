<template>
    <v-main>
        <v-navigation-drawer :color="$vuetify.theme.themes['light'].navigationDrawer" permanent app clipped>
            <v-list>
                <v-list-item to="/account/security">
                    <v-list-item-icon>
                        <v-icon>{{$vuetify.icons.values.security}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Security</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <app-header/>
        <v-container fill-height fluid v-if="loading">
            <v-row no-gutters align="center" justify="center">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </v-row>
        </v-container>
        <slot v-else/>
    </v-main>
</template>

<script>

    import AppHeader from '@/components/AppHeader';

    export default {

        name: 'Layout',

        data () {
            return {
            }
        },

        props: {
            navbar: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                default: true
            }
        },

        components: {
            AppHeader
        }
    };

</script>