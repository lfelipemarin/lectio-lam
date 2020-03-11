<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-list-group v-if="item.children" :key="item.title" v-model="item.model" :prepend-icon="item.icon"
                        append-icon="">
            <template v-slot:activator>
              <v-list-item class="pl-0">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item class="ml-3" v-for="(child, i) in item.children" :key="i" link :to="child.path">
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="text-wrap">
                  {{ child.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.title" link :to="item.path">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-badge color="green" content="nuevo" v-if="item.new">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-badge>
            <v-list-item-content v-else>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"
                          v-if="$store.state.isUserLoggedIn && !$store.state.isLoadingData"></v-app-bar-nav-icon>
      <v-toolbar-title @click="navigate('/')" style="cursor:pointer">Lectio Divina</v-toolbar-title>
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
        <v-menu left bottom :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="option in options" :key="option.name">
              <v-list-item-title>
                <v-switch class="pl-3 pb-2" v-model="$vuetify.theme.dark" :label="$vuetify.theme.dark?'Claro':'Oscuro'"
                          color="primary" hide-details>interfaz</v-switch>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <v-btn fab large bottom right fixed small color="error" class="v-btn--report"
             href="mailto:lectio.divina33@gmail.com?subject=Error ó comentario">
        <v-icon>mdi-bug</v-icon>
      </v-btn>
      <v-snackbar v-model="snackbar" :timeout="6000" color="info" right bottom :class="snackbarClass">
        {{snackbarMessage}}
      </v-snackbar>
    </v-content>
    <v-footer>
      <span>&copy; {{year}}</span>
    </v-footer>
  </v-app>
</template>

<script>
const firebase = require("firebase/app")
// Add the Firebase products that you want to use
require("firebase/auth")
import moment from 'moment'

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: false,
    items: [
      {
        path: '/',
        title: 'Inicio',
        icon: 'mdi-church'
      },
      {
        path: '/readings',
        title: 'Liturgia del Día',
        icon: 'mdi-book-cross'
      },
      {
        path: '/saints',
        title: 'Santos del Día',
        icon: 'mdi-account-heart'
      },
      {
        icon: 'mdi-alpha-j-circle',
        path: '',
        title: 'Milagros Eucaristicos',
        model: false,
        children: [
          { title: 'Por País', icon: 'mdi-flag', path: '/favorite-readings' },
          { title: 'Santos, Misticos Y la Eucaristía', icon: 'mdi-alpha-s-circle', path: '/favorite-saints' },
          { title: 'Nuestra Señora Y la Eucaristía', icon: 'mdi-alpha-m-circle', path: '/favorite-saints' },
          { title: 'Comuniones Prodigiosas', icon: 'mdi-heart-circle', path: '/favorite-saints' },
        ],
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
      {
        icon: 'mdi-heart',
        path: '',
        title: 'Favoritos',
        model: false,
        children: [
          { title: 'Lecturas Favoritas', icon: 'mdi-tag-heart', path: '/favorite-readings' },
          { title: 'Santos Favoritos', icon: 'mdi-head-heart', path: '/favorite-saints' }
        ],
      },
      {
        path: '/plan-mortificacion',
        title: 'Plan de Mortificaciones',
        icon: 'mdi-hand-heart',
        new: true
      },
    ],
    options: [
      {
        name: '',
        action: ''
      }
    ],
    snackbar: true,
    snackbarMessage: 'Envía comentarios ó reporta cualquier error aquí',
    snackbarClass: 'v-snackbar--report',
    year: moment().format('YYYY'),
    error: null,
    dialog: false,
    isLoading: false
  }),
  created () {
    this.$vuetify.theme.dark = this.$store.state.interfaceColor
  },
  methods: {
    logout () {
      this.drawer = false
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
      }).catch(function (error) {
        this.error = error
        // An error happened.
      });

      this.resetStore()
      this.$router.push({
        name: 'login'
      })
    },
    navigate (route, back) {
      if (back) {
        this.$router.back()
      } else {
        this.$router.push(route).catch(err => {
          this.error = err
        })
      }
    },
    changeInterfaceColor () {
      this.$store.dispatch('setInterfaceColor', this.$vuetify.theme.dark)
    },
    resetStore () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('setReadings', null)
      this.$store.dispatch('setEvgDetails', null)
      this.$store.dispatch('setSaints', null)
      this.$store.dispatch('setLectioText', null)
      this.$store.dispatch('setMeditatioText', null)
      this.$store.dispatch('setOratioText', null)
      this.$store.dispatch('setActioText', null)
      this.$store.dispatch('setActioReminder', null)
      this.$store.dispatch('setLectioArchive', { letPush: null, lectioArchive: null })
      this.$store.dispatch('resetExpiryDate', null)
    }
  },
  watch: {
    '$vuetify.theme.dark': function (val) {
      this.$store.dispatch('setInterfaceColor', val)
    }
  },
}
</script>
<style lang="sass" scoped>
.v-snackbar--report
  bottom: 88px !important
  .v-snack__wrapper
    min-width: 200px
    margin-right: 0

  .v-card__text, .v-card__title
    word-break: normal !important

.v-list-item__action
  margin-left: 0 !important
</style>