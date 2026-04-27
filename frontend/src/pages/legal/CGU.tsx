export default function CGU() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 p-6">
        <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation du site LibreForum.
                En accédant à ce site, vous acceptez d'être lié par ces conditions.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Accès au service</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                L'accès au site est gratuit et ouvert à tous, sous réserve de respecter les présentes conditions.
              </p>
              <p>
                L'utilisateur s'engage à ne pas utiliser le site à des fins illégales ou contraires à l'ordre public.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Contenu utilisateur</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                L'utilisateur est seul responsable du contenu qu'il publie sur le site.
              </p>
              <p>
                Il s'engage à ne pas publier de contenu :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Illégal, diffamatoire ou portant atteinte aux droits d'autrui</li>
                <li>Violent, haineux ou discriminatoire</li>
                <li>Pornographique ou à caractère sexuel</li>
                <li>Constituant de la publicité non sollicitée</li>
                <li>Portant atteinte aux droits de propriété intellectuelle</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Modération</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum se réserve le droit de modérer, supprimer ou refuser tout contenu qui ne respecterait pas les présentes conditions.
              </p>
              <p>
                Les décisions de modération sont souveraines et ne peuvent faire l'objet d'aucun recours.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum ne peut être tenu responsable du contenu publié par les utilisateurs.
              </p>
              <p>
                L'utilisateur utilise le site sous sa seule responsabilité.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Suspension du service</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum se réserve le droit de suspendre ou interrompre le service à tout moment, sans préavis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modification des CGU</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum se réserve le droit de modifier les présentes conditions à tout moment.
              </p>
              <p>
                Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}