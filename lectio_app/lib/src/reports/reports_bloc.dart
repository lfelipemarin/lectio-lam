import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lectio_app/src/reports/reports_service.dart';
import 'reports_state.dart';
import 'reports_event.dart';

class ReportsBloc extends Bloc<ReportsEvent, ReportsState> {
  final ReportsService reportsService = ReportsService();

  ReportsBloc() : super(LectiosInitial()) {
    on<FetchLectios>((event, emit) async {
      try {
        final List<DocumentSnapshot> lectios =
            await reportsService.getLectios();

        for (var doc in lectios) {
          print(doc.data());
        }
        emit(LectiosLoaded(lectios));
      } catch (e) {
        print('Error fetching lectios: $e');
        emit(FetchError(e.toString()));
      }
    });
  }
}
