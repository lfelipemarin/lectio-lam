<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-list-item>
          <v-icon left>mdi-calendar-month</v-icon>
          <v-list-item-content>
            <v-list-item-title class="headline text-wrap">{{evgDetails.data.date_displayed}}
            </v-list-item-title>
            <v-list-item-subtitle class="text-wrap">{{evgDetails.data.liturgic_title}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(reading, index) in readings" :key="index" cols="12" sm="12" md="6" lg="4">
        <v-card>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline text-wrap">{{`${reading.title}`}}
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">{{`${reading.reference_displayed}`}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <p>{{cleanText(reading.text)}}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn class="white--text" color="primary" @click="sendSelectionToLectio">
              Lectio Divina</v-btn>

            <div class="flex-grow-1"></div>

            <v-btn icon @click="addReadingToFavorites(reading)">
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon @click="readingSocialShare(reading)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" multi-line color="success" :timeout=4000>
          {{message}}
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>

      </v-col>
      <v-col cols="12" v-if="evgDetails.data.commentary">
        <v-card>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline text-wrap">Comentario de las lecturas
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">{{evgDetails.data.commentary.author.name}}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-wrap">{{evgDetails.data.commentary.author.short_description}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            {{cleanText(evgDetails.data.commentary.description)}}
          </v-card-text>
          <v-card-actions>

            <div class="flex-grow-1"></div>

            <!-- ToDO -->
            <!-- <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn> -->

            <v-btn icon @click="commentSocialShare(evgDetails.data.commentary)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  async mounted () {
    this.loading = false;
  },
  data () {
    return {
      evgDetails: this.$store.state.evgDetails,
      readings: this.$store.state.readings,
      loading: true,
      selection: '',
      snackbar: false,
      text: '',
      message: ''
    };
  },
  computed: {
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
    commentSocialShare (commentary) {
      if (navigator.share) {
        navigator.share({
          title: `${commentary.author.name} ${commentary.author.short_description}`,
          text: `*${commentary.author.name} ${commentary.author.short_description}* ${this.cleanText(commentary.description)}`,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
    },
    addReadingToFavorites (reading) {
      this.isLoading = true
      let readingToSave = _.clone(reading)
      let user = this.$store.state.user
      let now = this.$moment(new Date()).format()
      readingToSave.createdAt = now
      readingToSave.updatedAt = now
      lectioService.saveFavoriteReading(readingToSave, user).then(() => {
        // this.$store.dispatch('setLectioArchive', { lectioArchive, letPush: true })
        this.isLoading = false
        this.message = 'Lectura agregada a favoritos'
        this.snackbar = true
      }).catch((error) => {
        this.isLoading = false
        this.error = error
      })
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