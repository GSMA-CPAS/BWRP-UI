<template>
    <layout :loading="loading">
        <div>
            <iframe v-if="app" id="app-frame" class="app-frame" :src="'/app/' + app.packageName"></iframe>
        </div>
    </layout>

</template>
<script>

    import Layout from '@/components/layouts/Layout';

    export default {

        name: 'AppFrame',

        data: () => ({
            loading: true,
            app: null
        }),

        created: function() {
            setTimeout(() => {
                this.fetchAppConfig();
            }, 1000);
        },

        methods: {

            fetchAppConfig() {
                this.$http({method:'get', url: '/api/v1/apps/' + this.$route.params.name, withCredentials: true}).then((response) => {
                    this.app = response.data.app;
                    this.loading = false;
                }).catch( (error) => {
                    this.loading = false;
                    this.$modal.error(error);
                });
            }
        },

        components: {
            Layout
        }
    }

</script>

<style scoped>

    .app-frame {
        position: absolute;
        height: 100%;
        width: 100%;
        border: none;
    }

</style>