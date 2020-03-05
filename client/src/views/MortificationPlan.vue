<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-btn @click="generateRandomMorts">Generar</v-btn>
        <v-btn @click="clearRandomMorts">Limpiar</v-btn>
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
  mounted () {
    this.loading = false;
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
      includedMortifications: { DOMINGO: [], LUNES: [], MARTES: [], MIÉRCOLES: [], JUEVES: [], VIERNES: [], SÁBADO: [] }
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
        this.$store.commit('setWeeklyMortifications', value)
      }
    },
    storeAllMortifications: {
      get () {
        return this.$store.state.allMortifications
      },
      set (value) {
        this.$store.commit('setAllMortifications', value)
      }
    },
  },
  watch: {

  },

  methods: {
    generateRandomMorts () {
      debugger
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