<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-form>
          <v-text-field v-model="search" single-line solo label="Buscar Lectios" clearable></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12" sm="6" md="4" lg="3" v-for="(lectio) in filteredList" v-bind:key="lectio.id">
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
            <v-btn text color="amber accent-4">
              Read
            </v-btn>
            <v-btn text color="amber accent-4">
              Bookmark
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
    search: ''
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
      if (!this.search)
        return result

      const filterValue = this.search.toLowerCase()

      const filter = lectio =>
        lectio.lectio.toLowerCase().includes(filterValue) ||
        lectio.meditatio.toLowerCase().includes(filterValue) ||
        lectio.oratio.toLowerCase().includes(filterValue) ||
        lectio.contemplatio.toLowerCase().includes(filterValue) ||
        this.beautyDate(lectio.createdAt).includes(filterValue)

      return result.filter(filter)
    }
  },
}
</script>
<style>
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
  -webkit-backface-visibility: hidden;
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
</style>