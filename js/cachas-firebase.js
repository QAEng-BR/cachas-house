/* ─── Cachas House · Firebase compartido ───────────────────────────
   Cargar DESPUÉS de los SDK compat 9.22.0 (app + database [+ auth]).
   La apiKey es pública por diseño: la seguridad está en las reglas
   (firebase/database.rules.json). */
(function () {
  const firebaseConfig = {
    apiKey: 'AIzaSyAm6GOYzAZoA200g1mVpdZWnyEE855cFHo',
    authDomain: 'cachashouse-322a2.firebaseapp.com',
    databaseURL: 'https://cachashouse-322a2-default-rtdb.firebaseio.com',
    projectId: 'cachashouse-322a2',
    storageBucket: 'cachashouse-322a2.firebasestorage.app',
    messagingSenderId: '1074127981450',
    appId: '1:1074127981450:web:e6d4f28771f6affff65673',
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  /* Admins con todos los permisos. Si cambias esta lista, cambia también
     la función isAdmin de firebase/database.rules.json. */
  const ADMIN_EMAILS = ['cachashouse@gmail.com', 'brahianrinconsanchez01@gmail.com'];

  window.CH = {
    firebaseConfig,
    TEAM_EMAIL_DOMAIN: 'constructores.cachashouse.com',   // usuario → usuario@constructores.cachashouse.com
    db: firebase.database(),
    auth: typeof firebase.auth === 'function' ? firebase.auth() : null,
    SITE_URL: 'https://cachashouse.com',
    ADMIN_EMAILS,
    STAGES: [
      'Material en corte',
      'Material en el taller',
      'Ensamble en taller',
      'Control de calidad',
      'Alistamiento para instalación',
      'Instalación en sitio',
      'Entrega final',
    ],
    isAdminUser(user) {
      return !!user && user.emailVerified === true &&
        ADMIN_EMAILS.includes(String(user.email || '').toLowerCase());
    },
    esc(s) {
      return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
  };
})();
