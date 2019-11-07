<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col v-for="(reading, index) in favoriteReadings" :key="index" cols="12" sm="12" md="6" lg="4">
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
      favoriteReadings: []
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
    getAllFavoriteReadings () {
      let user = this.$store.state.user
      let favoriteReadings
      lectioService.getAllFavoriteReadings(user).then((collection) => {
        favoriteReadings = _.map(collection.docs, (doc) => {
          return doc.data()
        })
        this.favoriteReadings = _.sortBy(favoriteReadings, (reading) => {
          return reading.createdAt
        })

        this.loading = false
      }).catch((error) => {
        this.error = error
      })
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