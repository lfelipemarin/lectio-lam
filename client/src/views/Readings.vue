<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-list-item>
          <v-icon left>mdi-calendar-month</v-icon>
          <v-list-item-content>
            <v-list-item-title class="headline">{{evgDetails.data.date_displayed}}
            </v-list-item-title>
            <v-list-item-subtitle>{{evgDetails.data.liturgic_title}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(reading, index) in readings" :key="index" cols="12" sm="12" md="6" lg="4">
        <v-card>
          <v-list-item>
            <!-- <v-chip class="mt-2" color="primary" label text-color="white">
              <v-icon left>mdi-calendar-month</v-icon>
              {{beautyDate(lectio.createdAt)}}
            </v-chip> -->
            <v-list-item-content>
              <v-list-item-title class="headline">{{`${reading.title} ${reading.reference_displayed}`}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <p>{{cleanText(reading.text)}}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn class="white--text" color="amber accent-4" @click="sendSelectionToLectio">
              Lectio Divina</v-btn>

            <div class="flex-grow-1"></div>

            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=4000>
          Por favor selecciona una parte del texto
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
        <v-progress-circular :size="70" :width="7" color="amber" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VueContext } from "vue-context";
import _ from "lodash";
import lectioService from "../services/LectioService";

export default {
  components: { VueContext },
  async mounted () {
    await this.getTodaysGospel();
    this.loading = false;
  },
  data () {
    return {
      evgDetails: {},
      readings: [],
      loading: true,
      selection: '',
      snackbar: false
    };
  },
  computed: {
    // showReset () {
    //   return this.items.length < items.length
    // }
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
    // getSelection () {
    //   const para = document.querySelector('p')

    //   para.addEventListener('pointerup', (event) => {
    //     console.log('Pointer down event')
    //     alert(window.getSelection())
    //   })
    // },
    async getTodaysGospel () {
      const response = await lectioService.getTodaysGospel();
      this.evgDetails = response.data;
      this.readings = response.data.data.readings;
      // this.addListeners();
    },
    addListeners () {
      const para = document.querySelectorAll("p");
      let tEvents = ["mouseup"];

      _.each(para, par => {
        _.each(tEvents, tEvent => {
          par.addEventListener(tEvent, e => {
            console.log(e.type);
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
        this.$router.push({ name: 'lectio', params: { copiedLectioText: this.selection, readings: this.readings } })
      } else {
        this.snackbar = true
      }
    },

    remove (index) {
      this.$delete(this.items, index);
    },
    cleanText (text) {
      const regex = /\[{2}.*?\]{2}/gm;
      const subst = ``;

      // The substituted value will be contained in the result variable
      const result = text.replace(regex, subst);

      return result
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
}
</style>