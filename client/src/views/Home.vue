<template>
  <v-container grid-list-xs fill-height class="flex-column" justify-center v-if="!$store.state.isUserLoggedIn">
    <v-row align="end" justify="center">
      <h1>LECTIO DIVINA</h1>
    </v-row>
    <v-row class="mt-3">
      <v-btn color="amber" class="mt-5 mr-5" to="/login">Ingresar</v-btn>
      <v-btn color="amber" class="mt-5" to="/signup">Registrarse</v-btn>
    </v-row>
  </v-container>
  <v-container fluid v-else>
    <v-row>
      <v-col sm="12" md="6">
        <v-card class="mt-4 mx-auto">
          <v-sheet class="v-sheet--offset mx-auto pb-3" color="cyan" elevation="12" max-width="calc(100% - 32px)">
            <div class="chart" ref="lectiosChart"> </div>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2 text-wrap">Tus Lectios Mensuales</div>
            <div class="subheading font-weight-light grey--text text-wrap">Llevas en total {{totalLectios}}
              conversaciones con el
              Señor</div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>
              mdi-clock
            </v-icon>
            <span class="caption grey--text font-weight-light text-wrap">tu última Lectio Divina:
              {{beautyDate(lastLectio.createdAt)}}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-card class="mt-4 mx-auto">
          <v-sheet class="v-sheet--offset mx-auto pb-3" color="cyan" elevation="12" max-width="calc(100% - 32px)">
            <div class="chart" ref="commitmentChart"></div>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">Compromisos Cumplidos Mensualmente</div>
            <!-- <div class="subheading font-weight-light grey--text">Last Campaign Performance</div> -->
            <v-divider class="my-2"></v-divider>
            <!-- <v-icon class="mr-2" small>
              mdi-clock
            </v-icon> -->
            <!-- <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import lectioService from "../services/LectioService"
import { mapGetters } from 'vuex'
import _ from 'lodash'
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"

am4core.useTheme(am4themes_animated)

export default {
  data: () => ({
    chartLectios: null,
    chartCommit: null,
  }),
  async mounted () {
    if (this.isExpired && this.$store.state.isUserLoggedIn) {
      await this.getTodaysReadings()
      await this.getAllLectios()
      await this.getTodaysSaints()
      this.$store.dispatch('setExpiryDate')
    }
    if (this.$store.state.isUserLoggedIn) {

      this.$nextTick(() => {
        setTimeout(() => {
          this.createChart(this.lectioData, am4charts.XYChart, this.$refs.lectiosChart, 'month')
          // this.createChart(this.countCommitments, am4charts.XYChart, this.$refs.commitmentChart, 'month', this.chartCommit)
        }, 500)
      })
    }
  },
  beforeDestroy () {
    if (this.chartLectios) {
      this.chartLectios.dispose()
    }
    if (this.chartCommit) {
      this.chartCommit.dispose()
    }
  },
  methods: {
    async getTodaysReadings () {
      let today = this.$moment().format('YYYY-MM-DD')
      const response = await lectioService.getTodaysReadings(today)
      this.$store.dispatch('setReadings', response.data.data.readings)
      this.$store.dispatch('setEvgDetails', response.data)
    },
    async getTodaysSaints () {
      let date = this.$moment().format()
      const response = await lectioService.getSaintsByDate(date);
      this.$store.dispatch('setSaints', response.data)
    },
    getAllLectios () {
      let user = this.$store.state.user
      let lectioArchive
      lectioService.getAllLectios(user).then((collection) => {
        lectioArchive = _.map(collection.docs, (doc) => {
          return doc.data()
        })
        lectioArchive = _.sortBy(lectioArchive, (lectio) => {
          return lectio.createdAt
        })

        this.$store.dispatch('setLectioArchive', { lectioArchive, letPush: false })
        this.loading = false
      }).catch((error) => {
        this.error = error
      })
    },
    // eslint-disable-next-line no-unused-vars
    createChart (data, chartType, container, categoryX) {
      let chart = am4core.create(container, chartType)

      chart.paddingRight = 20

      _.each(data, (value, key) => {
        chart.data.push({ month: key, name: 'name', value: value })
      })

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'month'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.minGridDistance = 20
      categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
        if (target.dataItem && target.dataItem.index & 2 == 2) {
          return dy + 20
        }
        return dy
      })
      setTimeout(() => {
        categoryAxis.zoomToIndexes(chart.data.length / 2, chart.data.length)
      }, 1000)

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.tooltip.disabled = true
      valueAxis.renderer.minWidth = 35

      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.categoryX = categoryX
      series.dataFields.valueY = "value"

      series.tooltipText = "{valueY.value}"
      chart.cursor = new am4charts.XYCursor()

      if (chart.data.length > 11) {
        let scrollbarX = new am4core.Scrollbar()
        //   scrollbarX.series.push(series)
        chart.scrollbarX = scrollbarX
        chart.scrollbarX.thumb.minWidth = 50
      }

      this.chartLectios = chart
    },
    beautyDate (date) {
      return `${this.$moment(date).format('D')} de ${this.$moment(date).format('MMM')} de ${this.$moment(date).format('YYYY')}`
    }
  },
  computed: {
    ...mapGetters([
      'isExpired'
    ]),

    lectioData () {
      return _.countBy(this.$store.state.lectioArchive, (lectio) => {
        return this.$moment(lectio.createdAt).format('MMMYY')
      })
    },
    commitmentData () {
      return _.countBy(this.$store.state.lectioArchive, (lectio) => {
        return lectio.completedActio
      })
    },
    totalLectios () {
      let total = 0
      _.each(this.lectioData, (val) => {
        total += val
      })
      return total
    },
    countCommitments () {
      let map = _.map(this.$store.state.lectioArchive, (lectio) => {

        return { completedActio: lectio.completedActio, month: this.$moment(lectio.createdAt).format('MMMYY') }
      })
      return { ...map }
    },
    lastLectio () {
      const lectioLength = this.$store.state.lectioArchive.length
      return this.$store.state.lectioArchive[lectioLength - 1]
    },
  },
}
</script>
<style lang="sass">
.v-sheet--offset 
  top: -24px
  position: relative

.chart 
  width: 100%
  height: 300px

h1
  font-size: 50px
  
</style>
