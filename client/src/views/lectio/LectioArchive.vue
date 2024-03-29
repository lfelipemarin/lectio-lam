<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-expansion-panels inset popout>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              Buscar Lectios Anteriores
              <template v-slot:actions>
                <v-icon color="primary">mdi-magnify</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="searchDate"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="searchDate" single-line solo label="por fecha" readonly clearable v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchDate"
                    type="month"
                    no-title
                    scrollable
                    @change="$refs.menu.save(searchDate)"
                  >
                  </v-date-picker>
                </v-menu>
                <v-text-field v-model="searchWord" single-line solo label="por palabra" clearable> </v-text-field>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-chip
          v-model="filterNotCompleted"
          filter
          @click="filterNotCompleted = !filterNotCompleted"
          outlined
          color="primary"
          class="float-right mt-4"
          >Ver compromisos no completados</v-chip
        >
      </v-col>
    </v-row>
    <v-fade-transition group class="row">
      <v-col cols="12" sm="6" md="4" lg="3" v-for="lectio in filteredList" :key="lectio.createdAt">
        <v-card shaped>
          <v-list-item>
            <v-chip
              outlined
              class="mt-2"
              color="primary"
              label
              :text-color="$vuetify.theme.dark ? 'white' : 'rgba(0, 0, 0, 0.54)'"
            >
              <v-icon left>mdi-calendar-month</v-icon>
              {{ beautyDate(lectio.createdAt) }}
            </v-chip>
          </v-list-item>
          <v-expand-transition>
            <v-card-text v-show="lectio.show">
              <h4>Lectio</h4>
              <p>{{ lectio.lectio | truncate(75) }}</p>
              <h4>Meditatio</h4>
              <p>{{ lectio.meditatio | truncate(75) }}</p>
              <h4>Oratio</h4>
              <p>{{ lectio.oratio | truncate(75) }}</p>
              <h4>Actio</h4>
              <p>{{ lectio.actio | truncate(75) }}</p>
            </v-card-text>
          </v-expand-transition>
          <v-list-item v-if="!lectio.completedActio">
            <div class="flex-grow-1"></div>
            <v-chip class="mt-2" color="warning" label text-color="white">
              <v-icon left>mdi-alarm</v-icon>
              Tienes un compromiso sin completar
            </v-chip>
          </v-list-item>
          <v-card-actions>
            <v-btn text color="primary" @click.stop="openLectioView(lectio)">
              Leer
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn icon @click="lectio.show = !lectio.show">
              <v-icon>{{ lectio.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-fade-transition>
    <v-progress-linear id="loading-progress" v-show="loadingMore" :size="70" :width="7" color="accent" indeterminate>
    </v-progress-linear>
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
import lectioService from '../../services/LectioService';

export default {
  data: () => ({
    searchWord: '',
    searchDate: '',
    menu: false,
    modal: false,
    limit: 10,
    lastVisible: null,
    error: null,
    loading: true,
    loadingMore: false,
    completedActio: false,
    filterNotCompleted: false,
    lectioArchive: [],
  }),
  mounted() {
    this.getAllLectios();
    this.scroll();
  },
  methods: {
    scroll() {
      let user = this.$store.state.user;
      window.onscroll = () => {
        if (this.lastVisible) {
          let bottomOfWindow =
            Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) +
              window.innerHeight +
              document.getElementById('loading-progress').offsetHeight ===
            document.documentElement.offsetHeight;

          if (bottomOfWindow) {
            this.loadingMore = true;
            lectioService.getAllLectios(user, this.limit, this.lastVisible).then(collection => {
              this.lastVisible = collection.docs[collection.docs.length - 1];
              _.map(collection.docs, doc => {
                let lectio = doc.data();
                lectio.show = false;
                this.lectioArchive.push(lectio);
              });
              this.loadingMore = false;
            });
          }
        }
      };
    },
    getAllLectios() {
      let user = this.$store.state.user;
      let lectioArchive;
      lectioService
        .getAllLectios(user, this.limit)
        .then(collection => {
          this.lastVisible = collection.docs[collection.docs.length - 1];
          lectioArchive = _.map(collection.docs, doc => {
            let lectio = doc.data();
            lectio.show = false;
            return lectio;
          });
          this.lectioArchive = _.sortBy(lectioArchive, lectio => {
            return lectio.createdAt;
          });
          // this.$store.dispatch('setLectioArchive', { lectioArchive, letPush: false })
          this.loading = false;
        })
        .catch(error => {
          this.error = error;
        });
    },
    checkLectioYear(year, lectioYear) {
      return year == this.$moment(lectioYear).format('YYYY');
    },
    checkLectioMonth(month, lectioMonth) {
      return month == this.$moment(lectioMonth).format('MMMM');
    },
    displayCard(year, month, createdAt) {
      return (
        this.checkLectioYear(year.year, createdAt) &&
        this.checkLectioMonth(month.month, createdAt) &&
        year.year == month.year
      );
    },
    beautyDate(date) {
      return this.$moment(date).format('MMMM-DD-YYYY');
    },
    parseSearchDate(date) {
      return this.$moment(date).format('YYYY-MM');
    },
    openLectioView(lectio) {
      this.$router.push({ path: `/lectio-archivo/`, name: 'previous-lectio', params: { date: lectio.createdAt } });
    },
  },
  computed: {
    lectios() {
      return this.$store.state.lectioArchive;
    },
    filteredList() {
      let result = _.orderBy(
        this.lectioArchive,
        lectio => {
          return lectio.createdAt;
        },
        ['desc']
      );
      let filter;
      let filterValueWord;
      let filterValueDate;

      if (!this.searchDate && !this.searchWord && !this.filterNotCompleted) return result;

      if (this.searchDate && this.searchWord) {
        filterValueDate = this.searchDate.toLowerCase();
        filterValueWord = this.searchWord.toLowerCase();

        filter = lectio =>
          this.parseSearchDate(lectio.createdAt).includes(filterValueDate) &&
          (lectio.lectio.toLowerCase().includes(filterValueWord) ||
            lectio.meditatio.toLowerCase().includes(filterValueWord) ||
            lectio.oratio.toLowerCase().includes(filterValueWord) ||
            lectio.actio.toLowerCase().includes(filterValueWord));
        return result.filter(filter);
      }
      if (this.filterNotCompleted) {
        filter = lectio => {
          return !lectio.completedActio;
        };
        return result.filter(filter);
      }
      if (this.searchWord) {
        filterValueWord = this.searchWord.toLowerCase();
        filter = lectio =>
          lectio.lectio.toLowerCase().includes(filterValueWord) ||
          lectio.meditatio.toLowerCase().includes(filterValueWord) ||
          lectio.oratio.toLowerCase().includes(filterValueWord) ||
          lectio.actio.toLowerCase().includes(filterValueWord);
      } else {
        filterValueDate = this.searchDate.toLowerCase();

        filter = lectio => this.parseSearchDate(lectio.createdAt).includes(filterValueDate);
      }

      return result.filter(filter);
    },
  },
};
</script>
<style scoped>
.v-expansion-panel::before {
  box-shadow: none;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active {
  transition-delay: 0.2s;
}
</style>
