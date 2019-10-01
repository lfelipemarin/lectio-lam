<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-list-item>
          <v-icon left>mdi-calendar-month</v-icon>
          <v-list-item-content>
            <v-list-item-title class="headline">{{moment().format('dddd MMMM DD, YYYY')}}
            </v-list-item-title>
            <!-- <v-list-item-subtitle>{{evgDetails.data.liturgic_title}}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(saint, index) in saints.data" :key="index" cols="12" sm="12" md="6" lg="4">
        <v-card>
          <v-img class="white--text" gradient="0deg, rgba(5,8,13,0.5508578431372548) 100%, rgba(0,212,255,1) 100%" height="200px" :src="saint.image_links.large" v-if="saint.image_links">
            <v-card-title class="align-end fill-height">{{saint.name}}</v-card-title>
          </v-img>
          <!-- <v-chip class="mt-2" color="primary" label text-color="white">
              <v-icon left>mdi-calendar-month</v-icon>
              {{beautyDate(lectio.createdAt)}}
            </v-chip> -->
          <v-card-text>
            <p>{{saint.name}}</p>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn class="white--text" color="amber accent-4" @click="sendSelectionToLectio">
              Lectio Divina</v-btn> -->
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
// import _ from "lodash";
import lectioService from "../services/LectioService";
import moment from 'moment';
moment.locale('es')

export default {
  async mounted () {
    await this.getTodaysSaints();
    this.loading = false;
  },
  data () {
    return {
      saints: [],
      loading: true,
      snackbar: false,
      moment: moment
    };
  },
  computed: {

  },
  watch: {

  },

  methods: {
    async getTodaysSaints () {
      let date = moment().format()
      const response = await lectioService.getSaintsByDate(date);
      this.saints = response.data;
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