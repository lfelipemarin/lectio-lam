import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lectio_app/src/auth/auth_bloc.dart';
import 'package:lectio_app/src/reports/reports_bloc.dart';
import 'package:lectio_app/src/reports/reports_event.dart';
import 'package:lectio_app/src/reports/reports_state.dart';
import 'package:lectio_app/src/reports/widgets/bar_graph_report_widget.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  static const routeName = '/reports';

  @override
  _ReportsScreenState createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  @override
  void initState() {
    super.initState();
    // Dispatch FetchLectios event when entering the screen
    context.read<ReportsBloc>().add(FetchLectios());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Reports'),
      ),
      body: BlocBuilder<ReportsBloc, ReportsState>(
        builder: (context, state) {
          if (state is LectiosLoaded) {
            // Extract data from state and pass it to BarGraphReportWidget
            final reportData = state.lectios.map((doc) => doc.data()).toList();
            return BarGraphReportWidget(
              getTitlesWidget: (value, meta) {
                // Your logic to return title widget based on value and meta
                return Text('${value.toInt()}');
              },
              reportData: reportData,
            );
          } else if (state is FetchError) {
            return Center(child: Text('Error: ${state.error}'));
          } else {
            // You can show a loading indicator or some placeholder widget here
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
