import 'dart:developer';

import 'package:cloud_firestore/cloud_firestore.dart';

class ReportsService {
  Future<List<DocumentSnapshot>> getLectios(String? userEmail) async {
    log(userEmail!);
    final CollectionReference lectiosCollection =
        FirebaseFirestore.instance.collection('users/$userEmail/lectios');
    final querySnapshot = await lectiosCollection.get();
    return querySnapshot.docs;
  }
}
