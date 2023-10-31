import 'package:cloud_firestore/cloud_firestore.dart';

class ReportsService {
  final CollectionReference lectiosCollection =
      FirebaseFirestore.instance.collection('lectios');

  Future<List<DocumentSnapshot>> getLectios() async {
    final querySnapshot = await lectiosCollection.get();
    return querySnapshot.docs;
  }
}
