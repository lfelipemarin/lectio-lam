import 'dart:developer';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lectio_app/src/reports/reports_service.dart';
import 'package:lectio_app/src/sesssion/user_session.dart';
import 'reports_state.dart';
import 'reports_event.dart';
import 'package:lectio_app/src/sesssion/session_manager.dart'; // Import SessionManager

class ReportsBloc extends Bloc<ReportsEvent, ReportsState> {
  final ReportsService reportsService = ReportsService();

  ReportsBloc() : super(LectiosInitial()) {
    on<FetchLectios>((event, emit) async {
      try {
        UserSession? userSession = await SessionManager.getUserSession();
        final List<DocumentSnapshot> lectios =
            await reportsService.getLectios(userSession!.userEmail);

        for (var doc in lectios) {
          print(doc.data());
        }
        emit(LectiosLoaded(lectios));
      } catch (e) {
        log('Error fetching lectios: $e');
        emit(FetchError(e.toString()));
      }
    });
  }
}
