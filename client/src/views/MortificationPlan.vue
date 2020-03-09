<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-btn @click="generateRandomMorts">Generar</v-btn>
        <v-btn @click="clearRandomMorts">Limpiar</v-btn>
        <v-btn @click="saveInGC">Guardar en Calendario de Google</v-btn>
        <v-btn @click="handleSignOut">Cerrar sesion</v-btn>
        <draggable v-model="storeAllMortifications" group="people" @start="drag=true" @end="drag=false">
          <template v-for="(mortification, i) in storeAllMortifications">
            <v-chip class="ma-2" color="indigo" text-color="white" draggable :key="i">
              <v-avatar left>
                <v-icon>{{mortification.icon}}</v-icon>
              </v-avatar>
              {{mortification.name}}
            </v-chip>

          </template>
        </draggable>
      </v-col>
    </v-row>
    <v-row>
      <template>
        <v-card class="mx-auto" max-width="600" width="300" tile v-for="(day, i) in days" :key="i">
          <v-list>
            <v-subheader>{{day}}</v-subheader>
            <v-list-item-group color="primary">
              <draggable v-model="storeWeeklyMortifications[day]" group="people" @start="drag=true" @end="drag=false">
                <template v-for="(mortification, i) in storeWeeklyMortifications[day]">
                  <v-chip class="ma-2" color="indigo" text-color="white" draggable :key="i">
                    <v-avatar left>
                      <v-icon>{{mortification.icon}}</v-icon>
                    </v-avatar>
                    {{mortification.name}}
                  </v-chip>
                </template>
              </draggable>
            </v-list-item-group>
          </v-list>
        </v-card>
      </template>
      <v-snackbar v-model="snackbar" multi-line color="success" :timeout=4000>
        Mortificaciones agregadas al Calendario de Google
        <v-btn color="white" text @click="snackbar = false">
          Cerrar
        </v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash"
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex';
// import lectioService from "../services/LectioService"

export default {
  components: {
    draggable
  },
  created () {
    // eslint-disable-next-line
    this.gapi = gapi;
    this.handleClientLoad();
  },
  mounted () {
    this.loading = false
    if (_.isEmpty(this.getWeeklyMortifications && this.getAllMortifications)) {
      this.$store.commit('setAllMortifications', this.mortifications)
      this.$store.commit('setWeeklyMortifications', this.includedMortifications)
    }
  },
  data () {
    return {
      loading: true,
      snackbar: false,
      days: ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'],
      mortifications: [{ name: 'Segundo heróico', icon: 'mdi-alarm' }, { name: 'Comer por separado', icon: 'mdi-pasta' }, { name: 'Pasar comidas con agua', icon: 'mdi-water' },
      { name: 'Comer sin sal', icon: 'mdi-shaker' }, { name: 'Bebidas sin azúcar', icon: 'mdi-grain' }, { name: 'Bañarse con agua fría', icon: 'mdi-shower-head' },
      { name: 'Piedra en el zapato', icon: 'mdi-shoe-formal' }, { name: 'Dormir sin almohada', icon: 'mdi-bed-empty' }, { name: 'Dormir en el suelo', icon: 'mdi-sleep' },
      { name: 'No comer comidas rápidas', icon: 'mdi-food-off' }, { name: 'Evitar miradas curiosas', icon: 'mdi-eye-settings' }, { name: 'No leer noticias escandalosas', icon: 'mdi-newspaper' },
      { name: 'No escuchar conversaciones ajenas', icon: 'mdi-chat-alert-outline' }, { name: 'Apagar el TV antes del fin de una serie', icon: 'mdi-television-off' },
      { name: 'No comer dulces', icon: 'mdi-candycane' }, { name: 'No usar perfumes', icon: 'mdi-bottle-tonic' }, { name: 'No hacer pereza', icon: 'mdi-alarm-snooze' },
      { name: 'No hablar cosas ociosas', icon: 'mdi-wechat' }, { name: 'Mirar menos el reloj', icon: 'mdi-watch' }, { name: 'No quejarse de las enfermedades', icon: 'mdi-hospital-box' },
      { name: 'Sonreir con los demás', icon: 'mdi-emoticon-excited' }, { name: 'Saludar a los demás', icon: 'mdi-hand-right' }, { name: 'Buscar tiempo de soledad', icon: 'mdi-home-account' },
      { name: 'Abstenerse de hacer chistes', icon: 'mdi-emoticon-tongue' }, { name: 'No hablar de mí', icon: 'mdi-account-check' }, { name: 'Vestirse austeramente', icon: 'mdi-human-female' },
      { name: 'Comprar sólo lo necesario', icon: 'mdi-cart-off' }, { name: 'No discutir innecesariamente', icon: 'mdi-account-tie-voice' }, { name: 'No quejarnos de nada', icon: 'mdi-emoticon-cry' },
      { name: 'Hablar solo lo necesario', icon: 'mdi-volume-off' }],
      includedMortifications: { DOMINGO: [], LUNES: [], MARTES: [], MIÉRCOLES: [], JUEVES: [], VIERNES: [], SÁBADO: [] },
      authorized: false
    }
  },
  computed: {
    ...mapGetters([
      'getWeeklyMortifications',
      'getAllMortifications'
    ]),
    storeWeeklyMortifications: {
      get () {
        return this.$store.state.weeklyMortifications
      },
      set (value) {
        this.$store.dispatch('setWeeklyMortifications', _.cloneDeep(value))
      }
    },
    storeAllMortifications: {
      get () {
        return this.$store.state.allMortifications
      },
      set (value) {
        this.$store.dispatch('setAllMortifications', _.cloneDeep(value))
      }
    },
  },
  methods: {
    generateRandomMorts () {
      this.includedMortifications = _.each(this.includedMortifications, day => {
        let randomIndex = Math.floor(Math.random() * this.mortifications.length)
        day.push(this.mortifications[randomIndex])
        this.mortifications = _.remove(this.mortifications, mortification => {
          return mortification != this.mortifications[randomIndex]
        })
        this.$store.dispatch('setAllMortifications', _.cloneDeep(this.mortifications))
      })
      this.$store.dispatch('setWeeklyMortifications', _.cloneDeep(this.includedMortifications))
    },
    /**
    *  On load, called to load the auth2 library and API client library.
    */
    handleClientLoad () {
      this.gapi.load('client:auth2', this.initGC);
    },
    initGC () {
      // Array of API discovery doc URLs for APIs used by the quickstart
      let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      let SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"

      this.gapi.client.init({
        apiKey: process.env.VUE_APP_GC_API_KEY,
        clientId: process.env.VUE_APP_GC_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        // Listen for sign-in state changes.
        this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      }, function (error) {
        // appendPre(JSON.stringify(error, null, 2));
        console.log('GC error: ', error)
      });
    },
    updateSigninStatus (isSignedIn) {
      this.authorized = isSignedIn
      if (this.authorized) {
        this.saveInGC()
      }
    },
    handleSignOut () {
      this.gapi.auth2.getAuthInstance().signOut()
    },
    generateBatchEvents () {
      let newEvent = {}
      let index = 1
      let events = _.map(this.storeWeeklyMortifications, (mortification) => {
        if (mortification[0]) {
          newEvent = {
            'summary': mortification[0].name,
            // 'location': '800 Howard St., San Francisco, CA 94103',
            'description': mortification[0].name,
            'start': {
              'date': this.findNextWeekDay(index).format('YYYY-MM-DD'),
              'timeZone': 'America/Bogota'
            },
            'end': {
              'date': this.findNextWeekDay(index).format('YYYY-MM-DD'),
              'timeZone': 'America/Bogota'
            },
            'reminders': {
              'useDefault': false,
              'overrides': [
                { 'method': 'email', 'minutes': 4 * 60 },
                { 'method': 'popup', 'minutes': 4 * 60 }
              ]
            }
          }
          index++
          return newEvent
        }
      })
      index = 1
      const batch = this.gapi.client.newBatch();
      events.map((r, j) => {
        batch.add(this.gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': events[j]
        }))
      })
      batch.then(() => {
        this.snackbar = true
      });
    },
    saveInGC () {
      this.authorized = this.gapi.auth2.getAuthInstance().isSignedIn.get()
      if (!this.authorized) {
        this.gapi.auth2.getAuthInstance().signIn()
      } else {
        this.generateBatchEvents()
      }
    },
    /** 
     * @param day number of the day I need
    */
    findNextWeekDay (day) {
      const today = this.$moment().weekday();

      if (today <= day) {
        return this.$moment().weekday(day);
      } else {
        // otherwise, give me *next week's* instance of that same day
        return this.$moment().add(1, 'weeks').weekday(day);
      }
    },
    clearRandomMorts () {
      const mortificationsOriginal = [{ name: 'Segundo heróico', icon: 'mdi-alarm' }, { name: 'Comer por separado', icon: 'mdi-pasta' }, { name: 'Pasar comidas con agua', icon: 'mdi-water' },
      { name: 'Comer sin sal', icon: 'mdi-shaker' }, { name: 'Bebidas sin azúcar', icon: 'mdi-grain' }, { name: 'Bañarse con agua fría', icon: 'mdi-shower-head' },
      { name: 'Piedra en el zapato', icon: 'mdi-shoe-formal' }, { name: 'Dormir sin almohada', icon: 'mdi-bed-empty' }, { name: 'Dormir en el suelo', icon: 'mdi-sleep' },
      { name: 'No comer comidas rápidas', icon: 'mdi-food-off' }, { name: 'Evitar miradas curiosas', icon: 'mdi-eye-settings' }, { name: 'No leer noticias escandalosas', icon: 'mdi-newspaper' },
      { name: 'No escuchar conversaciones ajenas', icon: 'mdi-chat-alert-outline' }, { name: 'Apagar el TV antes del fin de una serie', icon: 'mdi-television-off' },
      { name: 'No comer dulces', icon: 'mdi-candycane' }, { name: 'No usar perfumes', icon: 'mdi-bottle-tonic' }, { name: 'No hacer pereza', icon: 'mdi-alarm-snooze' },
      { name: 'No hablar cosas ociosas', icon: 'mdi-wechat' }, { name: 'Mirar menos el reloj', icon: 'mdi-watch' }, { name: 'No quejarse de las enfermedades', icon: 'mdi-hospital-box' },
      { name: 'Sonreir con los demás', icon: 'mdi-emoticon-excited' }, { name: 'Saludar a los demás', icon: 'mdi-hand-right' }, { name: 'Buscar tiempo de soledad', icon: 'mdi-home-account' },
      { name: 'Abstenerse de hacer chistes', icon: 'mdi-emoticon-tongue' }, { name: 'No hablar de mí', icon: 'mdi-account-check' }, { name: 'Vestirse austeramente', icon: 'mdi-human-female' },
      { name: 'Comprar sólo lo necesario', icon: 'mdi-cart-off' }, { name: 'No discutir innecesariamente', icon: 'mdi-account-tie-voice' }, { name: 'No quejarnos de nada', icon: 'mdi-emoticon-cry' },
      { name: 'Hablar solo lo necesario', icon: 'mdi-volume-off' }]
      const includedMortificationsOriginal = { DOMINGO: [], LUNES: [], MARTES: [], MIÉRCOLES: [], JUEVES: [], VIERNES: [], SÁBADO: [] }
      this.$store.dispatch('setWeeklyMortifications', includedMortificationsOriginal)
      this.$store.dispatch('setAllMortifications', mortificationsOriginal)
      this.mortifications = _.cloneDeep(mortificationsOriginal)
      this.includedMortifications = _.cloneDeep(includedMortificationsOriginal)
    }
  }
}
</script>
<style lang="sass" scoped>
</style>