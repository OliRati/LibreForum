export default function PolitiqueConfidentialite() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum collecte les données suivantes :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Données d'inscription : nom d'utilisateur, adresse email</li>
                <li>Données de navigation : adresse IP, cookies, logs de connexion</li>
                <li>Contenu publié : messages, commentaires, sujets de discussion</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Les données collectées sont utilisées pour :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Fournir et améliorer le service</li>
                <li>Assurer la sécurité et la modération du site</li>
                <li>Communiquer avec les utilisateurs</li>
                <li>Respecter les obligations légales</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Partage des données</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum ne partage pas vos données personnelles avec des tiers, sauf :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Avec votre consentement explicite</li>
                <li>Pour respecter une obligation légale</li>
                <li>Pour protéger les droits et la sécurité de LibreForum</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Sécurité des données</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, l'altération, la divulgation ou l'accès non autorisé.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Les données sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, et en conformité avec les obligations légales.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à : contact@libreforum.local
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Ce site utilise des cookies pour améliorer votre expérience. Consultez notre politique de cookies pour plus d'informations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}