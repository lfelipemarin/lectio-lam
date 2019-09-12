<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item v-for="(path, index) in paths" :key="index" :to="path.path">
          <v-list-item-action>
            <v-icon>{{path.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{path.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    paths: [
      {
        path: '/',
        title: 'Home',
        icon: 'mdi-church'
      },
      {
        path: '/readings',
        title: 'Daily Readings',
        icon: 'mdi-bible'
      },
      {
        path: '/saints',
        title: 'Daily Saints',
        icon: 'mdi-account-heart'
      },
      {
        path: '/lectio',
        title: 'Lectio Divia',
        icon: 'mdi-notebook'
      }
    ]
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
}
</script>