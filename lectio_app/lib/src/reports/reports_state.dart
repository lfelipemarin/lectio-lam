abstract class ReportsState {}

class LectiosInitial extends ReportsState {}

class LectiosLoaded extends ReportsState {
  final List lectios;

  LectiosLoaded(this.lectios);
}

class FetchError extends ReportsState {
  final String error;

  FetchError(this.error);

  get message => null;
}
