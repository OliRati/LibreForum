export default function MentionsLegales() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Informations générales</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                <strong>Nom du site :</strong> LibreForum
              </p>
              <p>
                <strong>Éditeur :</strong> Projet étudiant en Développement Web et Web Mobile
              </p>
              <p>
                <strong>Responsable de publication :</strong> Étudiant développeur
              </p>
              <p>
                <strong>Hébergement :</strong> Serveur local de développement
              </p>
              <p>
                <strong>Contact :</strong> contact@libreforum.local
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Conditions d'utilisation</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                L'utilisation de ce site implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après.
              </p>
              <p>
                Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Le contenu de ce site (textes, images, graphismes, logos, icônes, sons, logiciels) est protégé par le droit d'auteur et appartient à LibreForum ou à ses partenaires.
              </p>
              <p>
                Toute reproduction, distribution, modification ou exploitation commerciale, même partielle, des éléments du site est strictement interdite sans autorisation préalable écrite.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilité</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site.
              </p>
              <p>
                Cependant, LibreForum ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p>
                LibreForum décline toute responsabilité pour les dommages directs ou indirects résultant de l'utilisation de ce site.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Liens hypertextes</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Le site peut contenir des liens vers d'autres sites. LibreForum n'exerce aucun contrôle sur ces sites externes et décline toute responsabilité quant à leur contenu.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Protection des données personnelles</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, contactez-nous à l'adresse : contact@libreforum.local
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Ce site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies.
              </p>
              <p>
                Vous pouvez à tout moment désactiver l'utilisation des cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}