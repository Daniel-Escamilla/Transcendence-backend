export enum AuthSubjects {
  register = 'auth.register',
  login = 'auth.login',
  verify = 'auth.verify',
  health = 'auth.health.check',
}

export enum UserSubjects {
  me = 'user.me',
  health = 'user.health.check',
}

export enum GameSubjects {
  health = 'game.health.check',
}

export enum TournamentSubjects {
  health = 'tournament.health.check',
}
