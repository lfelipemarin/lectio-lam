<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped disable-resize-watcher>
      <v-list dense>
        <v-list-item v-for="(path, index) in paths" :key="index" @click="navigate(path.path)">
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$store.state.isUserLoggedIn"></v-app-bar-nav-icon>
      <v-btn icon @click="navigate(null,'back')" v-if="$store.state.isUserLoggedIn">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
      </v-btn>
      <v-toolbar-title @click="navigate('/')" style="cursor:pointer">Lectio LAM</v-toolbar-title>
      <div class="flex-grow-1"></div>

      <v-tooltip bottom v-if="!$store.state.isUserLoggedIn">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="navigate('login')">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <span>Login</span>
      </v-tooltip>
      <v-tooltip bottom v-if="!$store.state.isUserLoggedIn">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="navigate('signup')">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span>Register</span>
      </v-tooltip>
      <!-- <div v-if="$store.state.isUserLoggedIn"> -->
      <div>
        <v-tooltip bottom v-if="$store.state.isUserLoggedIn">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
        <v-menu left bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="n in 5" :key="n" @click="() => {}">
              <v-list-item-title>Option {{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer>
      <span>&copy; {{year}}</span>
    </v-footer>
  </v-app>
</template>

<script>
const firebase = require("firebase/auth");
import moment from 'moment';

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
    paths: [
      {
        path: '/',
        title: 'Inicio',
        icon: 'mdi-church'
      },
      {
        path: '/readings',
        title: 'Liturgia del Día',
        icon: 'mdi-bible'
      },
      {
        path: '/saints',
        title: 'Santos del Día',
        icon: 'mdi-account-heart'
      },
      {
        path: '/lectio',
        title: 'Lectio Divina',
        icon: 'mdi-notebook'
      },
      {
        path: '/lectio-archivo',
        title: 'Lectios Guardadas',
        icon: 'mdi-folder-heart'
      },
    ],
    year: moment().format('YYYY')
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
  methods: {
    logout () {
      this.drawer = false
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log('signed out')
      }).catch(function (error) {
        // An error happened.
        console.log('signed out error', error)
      });

      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'login'
      })
    },
    navigate (route, back) {
      if (back) {
        this.$router.back()
      } else {
        this.$router.push(route)
      }
    }
  },
}
</script>