export default function PolitiqueCookies() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 p-6">
        <h1 className="text-3xl font-bold mb-6">Politique de cookies</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site web.
                Il permet au site de se souvenir de vos actions et préférences pendant une période donnée.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Cookies utilisés sur LibreForum</h2>
            <div className="space-y-4 text-zinc-300">
              <h3 className="text-lg font-semibold">Cookies essentiels</h3>
              <p>
                Ces cookies sont nécessaires au fonctionnement du site :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Session PHP : maintient votre session de connexion</li>
                <li>CSRF Token : protège contre les attaques CSRF</li>
              </ul>

              <h3 className="text-lg font-semibold">Cookies de fonctionnalité</h3>
              <p>
                Ces cookies améliorent l'expérience utilisateur :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Préférences d'affichage : thème, langue</li>
                <li>Historique de navigation</li>
              </ul>

              <h3 className="text-lg font-semibold">Cookies analytiques</h3>
              <p>
                Ces cookies nous aident à comprendre l'utilisation du site :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Nombre de visiteurs</li>
                <li>Pages les plus consultées</li>
                <li>Source du trafic</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Durée de conservation</h2>
            <div className="space-y-4 text-zinc-300">
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                <li>Cookies persistants : jusqu'à 1 an maximum</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Gestion des cookies</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Vous pouvez gérer vos cookies de plusieurs manières :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Paramètres de votre navigateur</li>
                <li>Outils de gestion des cookies intégrés</li>
                <li>Extensions de navigateur (uBlock Origin, Privacy Badger)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Consentement</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                En continuant à naviguer sur ce site, vous acceptez l'utilisation des cookies selon cette politique.
              </p>
              <p>
                Vous pouvez retirer votre consentement à tout moment en modifiant vos paramètres de cookies.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Pour toute question concernant cette politique de cookies, contactez-nous à : contact@libreforum.local
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}