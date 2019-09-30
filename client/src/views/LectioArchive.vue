<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-expansion-panels inset popout>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <template v-slot:actions>
                <v-icon color="primary">mdi-magnify</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form>
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="searchDate"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="searchDate" single-line solo label="Buscar Lectios por fecha" readonly
                                  clearable v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="searchDate" type="month" no-title scrollable
                                 @change="$refs.menu.save(searchDate)">
                  </v-date-picker>
                </v-menu>
                <v-text-field v-model="searchWord" single-line solo label="Buscar Lectios por palabra" clearable>
                </v-text-field>
                <v-text-field v-model="searchVerse" single-line solo label="Buscar Lectios por versículo" clearable>
                </v-text-field>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" xs="6" sm="6" md="4" lg="3" v-for="(lectio) in filteredList" v-bind:key="lectio.id">
        <v-card class="mx-auto">
          <v-list-item>
            <v-chip class="mt-2" color="primary" label text-color="white">
              <v-icon left>mdi-calendar-month</v-icon>
              {{beautyDate(lectio.createdAt)}}
            </v-chip>
            <!-- <v-list-item-content>
              <v-list-item-title class="headline">Our Changing Planet</v-list-item-title>
              <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
            </v-list-item-content> -->
          </v-list-item>

          <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg" height="194"></v-img> -->

          <v-card-text>
            <h4>Lectio</h4>
            <p>{{lectio.lectio | truncate(50)}}</p>
            <h4>Meditatio</h4>
            <p>{{lectio.meditatio | truncate(50)}}</p>
            <h4>Oratio</h4>
            <p>{{lectio.oratio | truncate(50)}}</p>
            <h4>Contemplatio</h4>
            <p>{{lectio.contemplatio | truncate(50)}}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn text color="amber accent-4"
                   @click.stop="openLectioDialog(lectio.lectio,lectio.meditatio,lectio.oratio,lectio.contemplatio)">
              Leer
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog.open" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog.open = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-toolbar-items>
                <v-btn dark text @click="dialog.open = false">Save</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-list three-line subheader>
              <v-subheader>{{dialog.lectio}}</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Content filtering</v-list-item-title>
                  <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Password</v-list-item-title>
                  <v-list-item-subtitle>Require password for purchase or use password to restrict purchase
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>General</v-subheader>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="notifications"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Notifications</v-list-item-title>
                  <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="sound"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Sound</v-list-item-title>
                  <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="widgets"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Auto-add widgets</v-list-item-title>
                  <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-container>
</template>
<script>
import lectioService from "../services/LectioService";
import moment from 'moment'
import _ from 'lodash'
moment.locale('es')

export default {
  data: () => ({
    lectios: [],
    searchWord: '',
    searchVerse: '',
    searchDate: '',
    menu: false,
    modal: false,
    moment: moment,
    dialog: {
      open: false,
      lectio: '',
      meditatio: '',
      oratio: '',
      contemplatio: '',
    }
  }),
  async mounted () {
    this.lectios = (await this.getAllLectios()).data
  },
  methods: {
    getAllLectios () {
      return lectioService.getAllLectios({ UserId: this.$store.state.user.id })
    },
    checkLectioYear (year, lectioYear) {
      return year == moment(lectioYear).format('YYYY')
    },
    checkLectioMonth (month, lectioMonth) {
      return month == moment(lectioMonth).format('MMMM')
    },
    displayCard (year, month, createdAt) {
      return this.checkLectioYear(year.year, createdAt) && this.checkLectioMonth(month.month, createdAt) && year.year == month.year
    },
    beautyDate (date) {
      return moment(date).format('MMMM-DD-YYYY')
    },
    parseSearchDate (date) {
      return moment(date).format('YYYY-MM')
    },
    openLectioDialog (lectio, meditatio, oratio, contemplatio) {
      this.dialog.lectio = lectio
      this.dialog.meditatio = meditatio
      this.dialog.oratio = oratio
      this.dialog.contemplatio = contemplatio
      this.dialog.open = true
    }
  },
  computed: {
    filter () {
      return (item, search, textKey) => item[textKey].indexOf(search) > -1
    },
    sortLectiosByYear () {
      return _.orderBy(_.uniqBy(_.map(this.lectios, (lectio) => {
        return { year: moment(lectio.createdAt).format('YYYY') }
      }), 'year'), ['year'], ['desc'])
    },
    sortLectiosByMonth () {
      return _.orderBy(_.uniqBy(_.map(this.lectios, (lectio) => {
        return { date: moment(lectio.createdAt).format('YYYY-MMMM'), year: moment(lectio.createdAt).format('YYYY'), month: moment(lectio.createdAt).format('MMMM') }
      }), 'date'), ['date'], ['desc'])
    },
    filteredList () {

      let result = this.lectios
      let filter
      let filterValueWord
      let filterValueDate

      if (!this.searchDate && !this.searchWord)
        return result

      if (this.searchDate && this.searchWord) {
        filterValueDate = this.searchDate.toLowerCase()
        filterValueWord = this.searchWord.toLowerCase()

        filter = lectio =>
          this.parseSearchDate(lectio.createdAt).includes(filterValueDate) &&
          (lectio.lectio.toLowerCase().includes(filterValueWord) ||
            lectio.meditatio.toLowerCase().includes(filterValueWord) ||
            lectio.oratio.toLowerCase().includes(filterValueWord) ||
            lectio.contemplatio.toLowerCase().includes(filterValueWord))
        return result.filter(filter)
      }
      if (this.searchWord) {

        filterValueWord = this.searchWord.toLowerCase()
        filter = lectio =>
          lectio.lectio.toLowerCase().includes(filterValueWord) ||
          lectio.meditatio.toLowerCase().includes(filterValueWord) ||
          lectio.oratio.toLowerCase().includes(filterValueWord) ||
          lectio.contemplatio.toLowerCase().includes(filterValueWord)
      } else {
        filterValueDate = this.searchDate.toLowerCase()

        filter = lectio =>
          this.parseSearchDate(lectio.createdAt).includes(filterValueDate)
      }

      return result.filter(filter)
    }
  },
}
</script>
<style scoped>
@media only screen and (min-width: 500px) {
  .cards {
    column-count: 1;
  }
}

@media only screen and (min-width: 700px) {
  .cards {
    column-count: 3;
  }
}

@media only screen and (min-width: 900px) {
  .cards {
    column-count: 4;
  }
}

.card {
  background: #f5f5f5;
  padding: 10px;
  margin: 0 0 1em;
  width: 100%;
  cursor: pointer;
  display: inline-block;
  color: black;
  -webkit-perspective: 1000;
  perspective: 1000;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: all 100ms ease-in-out;
}

.card:hover {
  transform: translateY(-0.5em);
  background: #ebebeb;
}

img {
  display: block;
  width: 100%;
}

.v-expansion-panel::before {
  box-shadow: none;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
}
</style>