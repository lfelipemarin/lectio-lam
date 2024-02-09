import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

typedef TitlesWidgetCallback = Widget Function(double value, TitleMeta meta);

class BarGraphReportWidget extends StatelessWidget {
  final List<dynamic> reportData;
  final TitlesWidgetCallback getTitlesWidget;

  const BarGraphReportWidget({
    Key? key,
    required this.getTitlesWidget,
    required this.reportData,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Log the reportData
    log('Report Data: $reportData');

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Text(
              'Monthly Sales Report',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              flex: 1,
              child: BarChart(
                BarChartData(
                  titlesData: FlTitlesData(
                    leftTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: getTitlesWidget,
                      ),
                    ),
                    topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                  ),
                  borderData: FlBorderData(show: true),
                  barGroups: [
                    BarChartGroupData(
                      x: 1,
                      barRods: [BarChartRodData(toY: 300, color: Colors.blue)],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [BarChartRodData(toY: 450, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 3,
                      barRods: [
                        BarChartRodData(toY: 600, color: Colors.orange),
                      ],
                    ),
                    // Add more data as needed
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
