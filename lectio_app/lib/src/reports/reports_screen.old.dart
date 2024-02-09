import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../common_widgets/card_widget.dart';
import 'widgets/bar_graph_report_widget.dart';

class ReportsScreenOld extends StatelessWidget {
  const ReportsScreenOld({super.key});

  static const routeName = '/reports';

  Widget monthsTitlesWidget(double month, TitleMeta meta) {
    String monthText = '';
    switch (month.toInt()) {
      case 1:
        monthText = 'Jan';
        break;
      case 2:
        monthText = 'Feb';
        break;
      case 3:
        monthText = 'Mar';
        break;
      case 4:
        monthText = 'Apr';
        break;
      case 5:
        monthText = 'May';
        break;
      case 6:
        monthText = 'Jun';
        break;
      case 7:
        monthText = 'Jul';
        break;
      case 8:
        monthText = 'Aug';
        break;
      case 9:
        monthText = 'Sep';
        break;
      case 10:
        monthText = 'Oct';
        break;
      case 11:
        monthText = 'Nov';
        break;
      case 12:
        monthText = 'Dec';
        break;
      default:
        monthText = '';
    }
    return Text(monthText);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Reportes de Lectio'),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              CardWidget(
                title: 'Tus lectios mensuales',
                cardBody:
                    BarGraphReportWidget(getTitlesWidget: monthsTitlesWidget),
              ),
              CardWidget(
                title: 'Compromisos mensuales',
                cardBody:
                    BarGraphReportWidget(getTitlesWidget: monthsTitlesWidget),
              ),
            ],
          ),
        ));
  }
}
