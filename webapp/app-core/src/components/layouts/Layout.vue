<template>
    <v-main>
        <app-header/>
        <v-container fill-height fluid v-if="loading">
            <v-row no-gutters align="center" justify="center">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </v-row>
        </v-container>
        <div v-else>
            <slot/>
        </div>
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