<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12" md="5">
        <v-text-field label="Buscar Santo" prepend-icon="mdi-magnify" v-model="searchWord"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list width="100%" subheader>
          <v-subheader>MIS SANTOS FAVORITOS</v-subheader>
          <v-fade-transition group>

            <v-list-item v-for="saint in filteredList" :key="saint.id" two-line hover>
              <v-list-item-avatar @click="openSaintView(saint)">
                <v-img v-if="showSaintAvatar(saint.image_links)[0]" :src="showSaintAvatar(saint.image_links)[0]">
                </v-img>
                <v-icon v-else>mdi-account-heart</v-icon>
              </v-list-item-avatar>

              <v-list-item-content @click="openSaintView(saint)">
                <v-list-item-title v-text="saint.name"></v-list-item-title>
                <v-list-item-subtitle>{{saint.date_displayed}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon @click="readyToDelete(saint)">
                <v-icon>mdi-close</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-fade-transition>
        </v-list>
        <v-snackbar v-model="snackbar" multi-line color="success" :timeout=4000>
          {{message}}
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
        <template>
          <v-row justify="center">

            <v-dialog v-model="dialog" max-width="290">
              <v-card>
                <v-card-title class="headline text-wrap">¿Eliminar santo de favoritos?</v-card-title>

                <v-card-text>
                  Si eliminas al santo de favoritos no lo podrás recuperar después.
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="dialog = false">
                    Cancelar
                  </v-btn>

                  <v-btn color="green darken-1" text @click="removeFavoriteSaint()">
                    Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <v-container fill-height v-else>
    <v-layout align-center>
      <v-flex xs12 text-center>
        <v-progress-circular :size="70" :width="7" color="accent" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash';
import lectioService from "../services/LectioService"

export default {
  async mounted () {
    this.loading = false
    this.getAllFavoriteSaints()
  },
  data () {
    return {
      // saints: this.$store.state.saints,
      loading: true,
      favoriteSaints: [],
      saintToDelete: {},
      dialog: false,
      snackbar: false,
      message: '',
      searchWord: ''
    };
  },
  computed: {
    beautyDate () {
      return `${this.$moment().format('dddd D')} de ${this.$moment().format('MMMM')} de ${this.$moment().format('YYYY')}`
    },
    filteredList () {
      let result = _.orderBy(this.favoriteSaints, (saint) => {
        return saint.date_displayed
      }, ['desc'])
      if (!this.searchWord)
        return result
        
      let filter
      let filterValueWord

      if (this.searchWord) {

        filterValueWord = this.searchWord.toLowerCase()
        filter = saint =>
          saint.name.toLowerCase().includes(filterValueWord) ||
          saint.date_displayed.toLowerCase().includes(filterValueWord)
      }

      return result.filter(filter)
    }
  },
  methods: {
    getAllFavoriteSaints () {
      let user = this.$store.state.user
      lectioService.getAllFavoriteSaints(user).onSnapshot((querySnapshot) => {
        let favoriteSaints = []
        querySnapshot.forEach(doc => {
          favoriteSaints.push(doc.data())
        })
        favoriteSaints = _.sortBy(favoriteSaints, (saint) => {
          return saint.createdAt
        })
        this.favoriteSaints = favoriteSaints

        this.loading = false
      })
    },
    readyToDelete (saint) {
      this.dialog = true
      this.saintToDelete = saint
    },
    removeFavoriteSaint () {
      let user = this.$store.state.user
      lectioService.deleteFavoriteSaint(this.saintToDelete, user).then(() => {
        this.message = "Santo removido de favoritos"
        this.dialog = false
        this.snackbar = true
      }).catch((error) => {
        this.error = error
      })
    },
    showSaintAvatar (imgObj) {
      return _.map(imgObj, (img) => {
        if (img) {
          return img
        }
      })
    },
    openSaintView (saint) {
      this.$router.push({ path: '/saints', name: "saint", params: { id: saint.id } })
    }
  }
};
</script>
<style lang="sass" scoped>
ul 
  padding: 0

.v-avatar 
  i
    border: 4px solid

.v-card__text, .v-card__title
  word-break: normal

.fade-enter-active,
.fade-leave-active
  transition: all 0.2s

.fade-enter,
.fade-leave-to
  opacity: 0

.fade-enter-active
  transition-delay: 0.2s

.v-list-item__avatar, .v-list-item__content, .v-list-item__icon
  cursor: pointer
</style>