<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12" md="5">
        <v-text-field label="Buscar Lectura" prepend-icon="mdi-magnify" v-model="searchWord"></v-text-field>
      </v-col>
    </v-row>
    <v-fade-transition group class="row">
      <v-col v-for="reading in filteredList" :key="reading.id" cols="12" sm="12" md="6" lg="4">
        <v-card>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline text-wrap">{{`${reading.title}`}}
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">{{`${reading.reference_displayed}`}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-icon class="mb-4" @click="readyToDelete(reading)">mdi-close</v-icon>
          </v-list-item>
          <v-card-actions>
            <v-chip outlined class="mt-2" color="primary" label
                    :text-color="$vuetify.theme.dark?'white':'rgba(0, 0, 0, 0.54)'">
              <v-icon left>mdi-calendar-month</v-icon>
              {{beautyDate(reading.createdAt)}}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn icon @click="reading.showText = !reading.showText">
              <v-icon>{{ reading.showText ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="reading.showText">
              <v-divider></v-divider>
              <v-card-text>
                {{cleanText(reading.text)}}
              </v-card-text>
              <v-card-actions>
                <v-btn class="white--text" color="primary" @click="sendSelectionToLectio">
                  Lectio Divina</v-btn>
                <div class="flex-grow-1"></div>
                <v-btn icon @click="readingSocialShare(reading)">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
          </v-expand-transition>
        </v-card>
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
                <v-card-title class="headline text-wrap">¿Eliminar lectura de favoritos?</v-card-title>

                <v-card-text>
                  Si eliminas la lectura de favoritos no la podrás recuperar despues.
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="dialog = false">
                    Cancelar
                  </v-btn>

                  <v-btn color="green darken-1" text @click="removeFavoriteReading()">
                    Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-col>
    </v-fade-transition>
    <v-flex xs12>
      <vue-context ref="menu">
        <template slot-scope="child" v-if="child.data">
          <li>
            <a href="#" @click.prevent="sendSelectionToLectio()">Agregar a Lectio de hoy</a>
          </li>
        </template>
      </vue-context>
    </v-flex>
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
import { VueContext } from "vue-context";
import _ from "lodash";
import lectioService from "../services/LectioService"

export default {
  components: { VueContext },
  mounted () {
    this.loading = false
    this.getAllFavoriteReadings()

  },
  data () {
    return {
      loading: true,
      selection: '',
      snackbar: false,
      text: '',
      message: '',
      favoriteReadings: [],
      dialog: false,
      readingToDelete: {},
      searchWord: '',
      showText: false
    };
  },
  computed: {
    filteredList () {
      let result = _.orderBy(this.favoriteReadings, (reading) => {
        return reading.createdAt
      }, ['desc'])
      if (!this.searchWord)
        return result

      let filter
      let filterValueWord

      if (this.searchWord) {

        filterValueWord = this.searchWord.toLowerCase()
        filter = reading =>
          reading.title.toLowerCase().includes(filterValueWord) ||
          reading.reference_displayed.toLowerCase().includes(filterValueWord)
      }

      return result.filter(filter)
    }
  },
  watch: {
    loading (val) {
      if (!val) {
        this.$nextTick(() => {
          this.addListeners();
        });
      }
    }
  },

  methods: {
    getAllFavoriteReadings () {
      let user = this.$store.state.user
      lectioService.getAllFavoriteReadings(user).onSnapshot((querySnapshot) => {
        let favoriteReadings = []
        querySnapshot.forEach(doc => {
          let reading = doc.data()
          reading.showText = false
          favoriteReadings.push(reading)
        })
        favoriteReadings = _.sortBy(favoriteReadings, (reading) => {
          return reading.createdAt
        })
        this.favoriteReadings = favoriteReadings

        this.loading = false
      })
    },
    readyToDelete (reading) {
      this.dialog = true
      this.readingToDelete = reading
    },
    removeFavoriteReading () {
      let user = this.$store.state.user
      lectioService.deleteFavoriteReading(this.readingToDelete, user).then(() => {
        this.message = "Lectura removida de favoritos"
        this.dialog = false
        this.snackbar = true
      }).catch((error) => {
        this.error = error
      })
    },
    beautyDate (date) {
      return this.$moment(date).format('MMMM-DD-YYYY')
    },
    addListeners () {
      const para = document.querySelectorAll("p");
      let tEvents = ["mouseup"];

      _.each(para, par => {
        _.each(tEvents, tEvent => {
          par.addEventListener(tEvent, e => {
            var selection;

            if (window.getSelection) {
              selection = window.getSelection();
            } else if (document.selection) {
              selection = document.selection.createRange();
            }
            if (selection.toString()) {
              this.selection = selection.toString()
              setTimeout(() => {
                this.$refs.menu.open(e, selection.toString());
              }, 0);
            }
          });
        });
      });
    },
    sendSelectionToLectio () {
      this.selection = window.getSelection().toString()
      if (this.selection) {
        this.$router.push({ name: 'lectio', params: { copiedLectioText: this.selection } })
      } else {
        this.message = 'Por favor selecciona una parte del texto'
        this.snackbar = true
      }
    },
    readingSocialShare (reading) {
      if (navigator.share) {
        navigator.share({
          title: `${reading.title} ${reading.reference_displayed}`,
          text: `*${reading.title} ${reading.reference_displayed}* ${this.cleanText(reading.text)}`,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
    },

    cleanText (text) {
      let regex = /\[{2}.*?\]{2}/gm
      let subst = ''
      let result = text.replace(regex, subst)

      subst = ' '
      result = result.replace(regex, subst)

      regex = /(\s)+/gm
      result = result.replace(regex, subst)

      return result.trim()
    }
  }
};
</script>
<style lang="sass">
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
</style>