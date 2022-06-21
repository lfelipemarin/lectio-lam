<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12" v-if="lectioInfo">
        <h2>Lectio</h2>
        <p>{{ lectioInfo.lectio }}</p>
        <h2>Meditatio</h2>
        <p>{{ lectioInfo.meditatio }}</p>
        <h2>Oratio</h2>
        <p>{{ lectioInfo.oratio }}</p>
        <h2>Actio</h2>
        <p>{{ lectioInfo.actio }}</p>
        <v-checkbox
          v-model="lectioInfo.completedActio"
          @change="changeCompletedActio(lectioInfo.completedActio)"
          label="¿Cumpliste el compromiso?"
        >
        </v-checkbox>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels :accordion="true" :flat="true" v-if="evgDetails">
          <v-expansion-panel>
            <v-expansion-panel-header>Ver lecturas de ese día</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="10">
                  <v-list-item>
                    <v-icon left>mdi-calendar-month</v-icon>
                    <v-list-item-content>
                      <v-list-item-title class="headline text-wrap">{{ evgDetails.date_displayed }} </v-list-item-title>
                      <v-list-item-subtitle class="text-wrap">{{ evgDetails.liturgic_title }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="(reading, index) in readings" :key="index" cols="12" sm="12" md="6" lg="4">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="headline text-wrap">{{ `${reading.title}` }} </v-list-item-title>
                      <v-list-item-subtitle class="text-wrap"
                        >{{ `${reading.reference_displayed}` }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <p>{{ cleanText(reading.text) }}</p>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-snackbar v-model="snackbar" multi-line color="success" :timeout="4000">
          Compromiso {{ lectioInfo.completedActio ? 'cumplido' : 'no cumplido' }}
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
        <v-progress-circular :size="70" :width="7" color="accent" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import lectioService from '../../services/LectioService';

export default {
  data() {
    return {
      evgDetails: {},
      readings: [],
      lectioInfo: null,
      loading: true,
      snackbar: false,
    };
  },
  mounted() {
    this.getDateReadings();
    let user = this.$store.state.user;
    // Listener for lectio changes
    lectioService.getLectioByCreatedDate(user, this.$route.params.date).onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.lectioInfo = doc.data();
        this.loading = false;
      });
    });
  },
  methods: {
    changeCompletedActio(value) {
      let user = this.$store.state.user;
      const now = this.$moment().format();
      lectioService
        .updateLectio(this.lectioInfo, user, { completedActio: value, updatedAt: now })
        .then(() => {
          this.snackbar = true;
        })
        .catch(error => {
          this.error = error;
        });
    },
    getDateReadings() {
      this.loading = true;
      let date = this.$moment(this.$route.params.date).format('YYYY-MM-DD');
      lectioService.getTodaysReadings(date).then(response => {
        this.evgDetails = response.data.data;
        this.readings = response.data.data.readings;
        this.loading = false;
      });
    },
    cleanText(text) {
      let regex = /\[{2}.*?\]{2}/gm;
      let subst = '';
      let result = text.replace(regex, subst);

      subst = ' ';
      result = result.replace(regex, subst);

      regex = /(\s)+/gm;
      result = result.replace(regex, subst);

      return result.trim();
    },
  },
};
</script>
<style lang="sass">
.v-expansion-panel-content
  .v-list-item
    padding: 0
</style>
