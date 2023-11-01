import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

typedef TitlesWidgetCallback = Widget Function(double value, TitleMeta meta);

class BarGraphReportWidget extends StatelessWidget {
  // final List<BarChartGroupData> reportData;
  final TitlesWidgetCallback getTitlesWidget;
  // const BarGraphReportWidget({super.key, required this.reportData});
  const BarGraphReportWidget({super.key, required this.getTitlesWidget});

  @override
  Widget build(BuildContext context) {
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
                        sideTitles: SideTitles(showTitles: true)),
                    bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: getTitlesWidget)),
                  ),
                  borderData: FlBorderData(
                    show: true,
                  ),
                  barGroups: [
                    BarChartGroupData(
                      x: 1,
                      barRods: [BarChartRodData(toY: 300, color: Colors.blue)],
                      showingTooltipIndicators: [0],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [BarChartRodData(toY: 450, color: Colors.green)],
                      showingTooltipIndicators: [0],
                    ),
                    BarChartGroupData(
                      x: 3,
                      barRods: [
                        BarChartRodData(toY: 600, color: Colors.orange),
                      ],
                      showingTooltipIndicators: [0],
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
