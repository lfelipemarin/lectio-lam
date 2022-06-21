<template>
  <v-container grid-list-xs fill-height class="flex-column" justify-center v-if="!$store.state.isUserLoggedIn">
    <div>
      <h1>LECTIO DIVINA</h1>
    </div>
    <div class="mt-3">
      <v-btn color="primary" class="mt-5 mr-5" to="/login">Ingresar</v-btn>
      <v-btn color="primary" class="mt-5" to="/signup">Registrarse</v-btn>
    </div>
  </v-container>
  <v-container fluid v-else fill-height>
    <v-container fill-height v-if="$store.state.isLoadingData">
      <v-layout align-center>
        <v-flex xs12 text-center>
          <v-progress-circular :size="70" :width="7" color="accent" indeterminate></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    <v-row v-else>
      <v-col sm="12" md="6">
        <v-card class="mt-4 mx-auto">
          <v-sheet
            v-if="totalLectios"
            class="v-sheet--offset mx-auto pb-3"
            color="grey lighten-1"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <div class="chart" ref="lectiosChart"></div>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2 text-wrap">
              Tus Lectios Mensuales
            </div>
            <div class="subheading font-weight-light grey--text text-wrap">
              Llevas en total {{ totalLectios }}
              conversaciones con el Señor
              <div class="flex-grow-1"></div>
              <v-btn outlined small color="primary" to="/lectio" class="mt-2">ve a hacer la lectio</v-btn>
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>
              mdi-clock
            </v-icon>
            <span class="caption grey--text font-weight-light text-wrap"
              >tu última Lectio Divina: {{ lastLectio ? beautyDate(lastLectio.createdAt) : '' }}</span
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-card class="mt-4 mx-auto">
          <v-sheet
            v-if="totalLectios"
            class="v-sheet--offset mx-auto pb-3"
            color="grey lighten-1"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <div class="chart" ref="commitmentChart"></div>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">
              Compromisos Cumplidos Mensualmente
            </div>
            <div class="subheading font-weight-light grey--text">
              Tienes {{ totalUnfulfilled }} compromisos sin cumplir
              <div class="flex-grow-1"></div>
              <v-btn outlined small color="primary" to="/lectio-archivo" class="mt-2"
                >ve a cumplirle al Señor ahora
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, onMounted, ref, nextTick, reactive, onBeforeUnmount } from '@vue/composition-api';
import lectioService from '../services/LectioService';
// import { mapGetters } from 'vuex';
import _ from 'lodash';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

function formatDate(value) {
  let date = new Date(value);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: '2-digit' });
  return (month + '.' + year).toLowerCase();
}

export default {
  setup(props, { root }) {
    const charts = reactive([]);
    const state = reactive({
      lectioArchive: [],
    });

    let error = ref('');
    const loading = ref(false);
    const store = root.$store;
    const router = root.$router;
    const commitmentData = computed(() => {
      if (state.lectioArchive.length) {
        return _.countBy(
          _.pickBy(state.lectioArchive, lectio => {
            return lectio.completedActio == true;
          }),
          lectio => {
            return formatDate(lectio.createdAt);
          }
        );
      }
      return null;
    });
    const lectioData = computed(() => {
      if (state.lectioArchive.length) {
        return _.countBy(state.lectioArchive, lectio => {
          return formatDate(lectio.createdAt);
        });
      }
      return null;
    });
    const totalLectios = computed(() => {
      let total = 0;
      _.each(lectioData.value, val => {
        total += val;
      });
      return total;
    });
    const lastLectio = computed(() => {
      if (state.lectioArchive.length) {
        const lectioLength = state.lectioArchive.length;
        return state.lectioArchive[lectioLength - 1];
      }
      return null;
    });

    const totalUnfulfilled = computed(() => {
      let total = 0;
      _.each(commitmentData.value, val => {
        total += val;
      });
      return totalLectios.value - total;
    });

    const commitmentChart = ref(null);
    const lectiosChart = ref(null);
    const chartCommit = '';

    function getAllLectios() {
      const user = store.state.user;
      let tmpLectioArchive;
      lectioService
        .getAllLectios(user)
        .then(collection => {
          tmpLectioArchive = _.map(collection.docs, doc => {
            return doc.data();
          });
          debugger;
          state.lectioArchive = _.sortBy(tmpLectioArchive, lectio => {
            return lectio.createdAt;
          });

          // this.$store.dispatch('setLectioArchive', { lectioArchive, letPush: false })
          loading.value = false;
        })
        .catch(err => {
          error.value = err;
        });
    }
    async function getTodaysReadings() {
      let today = new Date().toISOString().slice(0, 10);
      try {
        const response = await lectioService.getTodaysReadings(today);
        store.dispatch('setReadings', response.data.data.readings);
        store.dispatch('setEvgDetails', response.data);
      } catch (error) {
        store.dispatch('setIsLoadingData', false);
        router.push('/404');
      }
    }

    async function getTodaysSaints() {
      const day = new Date().toISOString().slice(8, 10);
      const month = new Date().toISOString().slice(5, 7);
      const response = await lectioService.getSaintsByDate(month, day);
      store.dispatch('setSaints', response.data);
    }

    function createChart(data, chartType, container, categoryX) {
      const chart = am4core.create(container, chartType);
      chart.colors.list = [am4core.color('#757575')];
      chart.paddingRight = 20;

      _.each(data, (value, key) => {
        chart.data.push({ month: key, name: 'name', value: value });
      });

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'month';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
        if (target.dataItem && target.dataItem.index & (2 == 2)) {
          return dy + 20;
        }
        return dy;
      });

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = categoryX;
      series.dataFields.valueY = 'value';

      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      if (chart.data.length > 11) {
        setTimeout(() => {
          categoryAxis.zoomToIndexes(chart.data.length / 2, chart.data.length);
        }, 1000);
        const scrollbarX = new am4core.Scrollbar();
        //   scrollbarX.series.push(series)
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.thumb.minWidth = 50;
      }

      charts.push(chart);
    }

    function beautyDate(value) {
      let date = new Date(value);
      const day = date.toLocaleString('default', { day: 'numeric' });
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.toLocaleString('default', { year: 'numeric' });
      return `${day} de ${month} de ${year}`;
    }

    onMounted(async () => {
      if (store.state.isUserLoggedIn) {
        store.dispatch('setIsLoadingData', true);
        await getAllLectios();
        const isExpired = computed(() => store.getters.isExpired);
        if (isExpired) {
          await getTodaysReadings();
          await getTodaysSaints();
          store.dispatch('setExpiryDate');
        }
        nextTick(() => {
          setTimeout(() => {
            if (totalLectios.value) {
              debugger;
              createChart(lectioData.value, am4charts.XYChart, lectiosChart.value, 'month');
              createChart(commitmentData.value, am4charts.XYChart, commitmentChart.value, 'month', chartCommit);
            }
          }, 3000);
        });
        store.dispatch('setIsLoadingData', false);
      }
    });
    onBeforeUnmount(() => {
      _.each(charts, chart => {
        chart.dispose();
        console.log(chart);
      });
    });
    return {
      beautyDate,
      totalLectios,
      lastLectio,
      totalUnfulfilled,
      lectiosChart,
      commitmentChart,
    };
  },
  // data: () => ({
  //   charts: [],
  //   lectioArchive: [],
  //   error: '',
  // }),
  // async mounted() {
  //   if (this.$store.state.isUserLoggedIn) {
  //     this.$store.dispatch('setIsLoadingData', true);
  //     await this.getAllLectios();
  //     if (this.isExpired) {
  //       await this.getTodaysReadings();
  //       await this.getTodaysSaints();
  //       this.$store.dispatch('setExpiryDate');
  //     }
  //     this.$nextTick(() => {
  //       setTimeout(() => {
  //         if (this.totalLectios) {
  //           this.createChart(this.lectioData, am4charts.XYChart, this.$refs.lectiosChart, 'month');
  //           this.createChart(
  //             this.commitmentData,
  //             am4charts.XYChart,
  //             this.$refs.commitmentChart,
  //             'month',
  //             this.chartCommit
  //           );
  //         }
  //       }, 3000);
  //     });
  //     this.$store.dispatch('setIsLoadingData', false);
  //   }
  // },
  // beforeDestroy() {
  //   _.each(this.charts, chart => {
  //     chart.dispose();
  //   });
  // },
  // methods: {
  //   async getTodaysReadings() {
  //     let today = this.$moment().format('YYYY-MM-DD');
  //     try {
  //       const response = await lectioService.getTodaysReadings(today);
  //       this.$store.dispatch('setReadings', response.data.data.readings);
  //       this.$store.dispatch('setEvgDetails', response.data);
  //     } catch (error) {
  //       this.$store.dispatch('setIsLoadingData', false);
  //       this.$router.push('/404');
  //     }
  //   },
  //   async getTodaysSaints() {
  //     const day = this.$moment().format('DD');
  //     const month = this.$moment().format('MM');
  //     const response = await lectioService.getSaintsByDate(month, day);
  //     this.$store.dispatch('setSaints', response.data);
  //   },
  //   getAllLectios() {
  //     let user = this.$store.state.user;
  //     let lectioArchive;
  //     lectioService
  //       .getAllLectios(user)
  //       .then(collection => {
  //         lectioArchive = _.map(collection.docs, doc => {
  //           return doc.data();
  //         });
  //         this.lectioArchive = _.sortBy(lectioArchive, lectio => {
  //           return lectio.createdAt;
  //         });

  //         // this.$store.dispatch('setLectioArchive', { lectioArchive, letPush: false })
  //         this.loading = false;
  //       })
  //       .catch(error => {
  //         this.error = error;
  //       });
  //   },
  //   // eslint-disable-next-line no-unused-vars
  //   createChart(data, chartType, container, categoryX) {
  //     const chart = am4core.create(container, chartType);
  //     chart.colors.list = [am4core.color('#757575')];
  //     chart.paddingRight = 20;

  //     _.each(data, (value, key) => {
  //       chart.data.push({ month: key, name: 'name', value: value });
  //     });

  //     const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //     categoryAxis.dataFields.category = 'month';
  //     categoryAxis.renderer.grid.template.location = 0;
  //     categoryAxis.renderer.minGridDistance = 20;
  //     categoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
  //       if (target.dataItem && target.dataItem.index & (2 == 2)) {
  //         return dy + 20;
  //       }
  //       return dy;
  //     });

  //     const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //     valueAxis.tooltip.disabled = true;
  //     valueAxis.renderer.minWidth = 35;

  //     const series = chart.series.push(new am4charts.ColumnSeries());
  //     series.dataFields.categoryX = categoryX;
  //     series.dataFields.valueY = 'value';

  //     series.tooltipText = '{valueY.value}';
  //     chart.cursor = new am4charts.XYCursor();

  //     if (chart.data.length > 11) {
  //       setTimeout(() => {
  //         categoryAxis.zoomToIndexes(chart.data.length / 2, chart.data.length);
  //       }, 1000);
  //       const scrollbarX = new am4core.Scrollbar();
  //       //   scrollbarX.series.push(series)
  //       chart.scrollbarX = scrollbarX;
  //       chart.scrollbarX.thumb.minWidth = 50;
  //     }

  //     this.charts.push(chart);
  //   },
  //   beautyDate(date) {
  //     return `${this.$moment(date).format('D')} de ${this.$moment(date).format('MMM')} de ${this.$moment(date).format(
  //       'YYYY'
  //     )}`;
  //   },
  // },
  // computed: {
  //   ...mapGetters(['isExpired']),

  //   lectioData() {
  //     if (this.lectioArchive) {
  //       return _.countBy(this.lectioArchive, lectio => {
  //         return this.$moment(lectio.createdAt).format('MMMYY');
  //       });
  //     }
  //     return null;
  //   },
  //   commitmentData() {
  //     if (this.lectioArchive) {
  //       return _.countBy(
  //         _.pickBy(this.lectioArchive, lectio => {
  //           return lectio.completedActio == true;
  //         }),
  //         lectio => {
  //           return this.$moment(lectio.createdAt).format('MMMYY');
  //         }
  //       );
  //     }
  //     return null;
  //   },
  //   totalUnfulfilled() {
  //     let total = 0;
  //     _.each(this.commitmentData, val => {
  //       total += val;
  //     });
  //     return this.totalLectios - total;
  //   },
  //   totalLectios() {
  //     let total = 0;
  //     _.each(this.lectioData, val => {
  //       total += val;
  //     });
  //     return total;
  //   },
  //   lastLectio() {
  //     if (this.lectioArchive) {
  //       const lectioLength = this.lectioArchive.length;
  //       return this.lectioArchive[lectioLength - 1];
  //     }
  //     return null;
  //   },
  // },
};
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
