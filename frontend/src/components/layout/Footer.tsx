import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-100">LibreForum</h3>
            <p className="text-sm text-zinc-400">
              Une plateforme de discussion libre et ouverte pour tous.
            </p>
            <p className="text-xs text-zinc-500">
              LibreForum est un projet mené dans le cadre d'un travail d'étudiant en Développement Web et Web mobile.
            </p>
          </div>

          {/* Liens légaux */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Légal
            </h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/mentions-legales" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgu" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Conditions générales d'utilisation
              </Link>
              <Link to="/confidentialite" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/cookies" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Politique de cookies
              </Link>
            </nav>
          </div>

          {/* Liens utiles */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Liens utiles
            </h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/contact" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Contact
              </Link>
              <Link to="/faq" className="text-zinc-400 hover:text-300 transition-colors">
                FAQ
              </Link>
              <Link to="/moderation" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Règles de modération
              </Link>
              <Link to="/signalement" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                Signaler un contenu
              </Link>
            </nav>
          </div>

          {/* Réseaux sociaux et copyright */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Suivez-nous
            </h4>
            <div className="flex space-x-4">
              {/* Icônes des réseaux sociaux - à remplacer par de vraies icônes */}
              <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            <div className="text-xs text-zinc-500">
              <p>&copy; {currentYear} LibreForum. Tous droits réservés.</p>
              <p className="mt-1">
                Propulsé par Symfony & React
              </p>
            </div>
          </div>
        </div>

        {/* Barre de séparation et mentions supplémentaires */}
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <div className="flex flex-col space-y-2 text-xs text-zinc-500 md:flex-row md:justify-between md:space-y-0">
            <div>
              <p>
                Ce site respecte la vie privée de ses utilisateurs et traite les données personnelles conformément au RGPD.
              </p>
            </div>
            <div className="flex space-x-4">
              <span>Version 1.0.0</span>
              <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}