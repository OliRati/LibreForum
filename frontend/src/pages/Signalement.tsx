export default function Signalement() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 p-6">
        <h1 className="text-3xl font-bold mb-6">Signaler un contenu</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Pourquoi signaler ?</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Le signalement permet de maintenir un environnement sain et respectueux sur LibreForum.
                En signalant un contenu problématique, vous contribuez à la qualité de la communauté.
              </p>
              <p>
                Tous les signalements sont traités de manière confidentielle par notre équipe de modération.
                Les informations que vous fournissez ne sont utilisées que pour l'examen du signalement.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Comment signaler un contenu ?</h2>
            <div className="space-y-4 text-zinc-300">
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Méthode recommandée</h3>
                <p className="mb-3">
                  La façon la plus simple et efficace de signaler un contenu est d'utiliser le bouton de signalement
                  directement sur le message concerné :
                </p>
                <ol className="list-decimal list-inside ml-4 space-y-2">
                  <li>Repérez le message que vous souhaitez signaler</li>
                  <li>Cliquez sur le bouton "Signaler" (icône de drapeau) sous le message</li>
                  <li>Sélectionnez le motif du signalement dans la liste déroulante</li>
                  <li>Ajoutez une description détaillée si nécessaire</li>
                  <li>Cliquez sur "Envoyer le signalement"</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Motifs de signalement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Contenus graves</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300 text-sm">
                  <li>Contenus illégaux ou criminels</li>
                  <li>Apologie de la haine ou discrimination</li>
                  <li>Menaces ou harcèlement</li>
                  <li>Contenus pédopornographiques</li>
                  <li>Violation de la vie privée</li>
                </ul>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-orange-400">Comportements inappropriés</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300 text-sm">
                  <li>Insultes ou attaques personnelles</li>
                  <li>Spam ou messages répétitifs</li>
                  <li>Trolling ou provocation</li>
                  <li>Contenus inappropriés</li>
                  <li>Non-respect des règles</li>
                </ul>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Contenus problématiques</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300 text-sm">
                  <li>Contenus hors-sujet</li>
                  <li>Publicité non sollicitée</li>
                  <li>Informations erronées</li>
                  <li>Violation des droits d'auteur</li>
                  <li>Autre (préciser)</li>
                </ul>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-green-400">Signalements techniques</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300 text-sm">
                  <li>Bug ou problème technique</li>
                  <li>Contenu inaccessible</li>
                  <li>Problème d'affichage</li>
                  <li>Erreur système</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Que se passe-t-il après un signalement ?</h2>
            <div className="space-y-4 text-zinc-300">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Traitement du signalement</h3>
                <ol className="list-decimal list-inside ml-4 space-y-2">
                  <li><strong>Examen initial :</strong> Un modérateur examine le signalement dans les 24 heures</li>
                  <li><strong>Investigation :</strong> Analyse du contexte et des éléments fournis</li>
                  <li><strong>Décision :</strong> Application d'une sanction si nécessaire</li>
                  <li><strong>Notification :</strong> Information aux parties concernées (anonymisée)</li>
                </ol>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Délais de traitement</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Signalements graves :</strong> Traités en moins de 6 heures</li>
                  <li><strong>Signalements standards :</strong> Traités en 24-48 heures</li>
                  <li><strong>Cas complexes :</strong> Jusqu'à 7 jours pour investigation approfondie</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Signalements anonymes</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Vous pouvez signaler un contenu de manière anonyme. Cependant, pour certains types de signalements
                (notamment les plus graves), nous pouvons être amenés à vous contacter pour obtenir des informations
                supplémentaires.
              </p>
              <p>
                Dans tous les cas, votre identité reste confidentielle et n'est pas divulguée aux autres utilisateurs.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Abus du système de signalement</h2>
            <div className="space-y-4 text-zinc-300">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <p>
                  <strong>Attention :</strong> Les signalements abusifs ou mal intentionnés peuvent entraîner des sanctions
                  contre l'auteur du signalement. Cela inclut :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>Signalements répétés et infondés</li>
                  <li>Utilisation du système pour harceler d'autres utilisateurs</li>
                  <li>Signalements visant à censurer des opinions légitimes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact direct</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Si vous préférez contacter directement l'équipe de modération plutôt qu'utiliser le système
                de signalement intégré :
              </p>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="mb-2"><strong>Email :</strong> moderation@libreforum.local</p>
                <p className="mb-2"><strong>Objet :</strong> [SIGNALEMENT] - Description brève</p>
                <p>
                  <strong>Informations à fournir :</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li>Lien vers le contenu signalé</li>
                  <li>Motif détaillé du signalement</li>
                  <li>Contexte supplémentaire si nécessaire</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Questions fréquentes</h2>
            <div className="space-y-4">
              <div className="border-b border-zinc-700 pb-4">
                <h3 className="text-lg font-semibold mb-2 text-zinc-100">Puis-je signaler mon propre contenu ?</h3>
                <p className="text-zinc-300">
                  Oui, vous pouvez demander la suppression ou modification de votre propre contenu en nous contactant
                  directement. Le système de signalement est principalement destiné aux contenus d'autres utilisateurs.
                </p>
              </div>

              <div className="border-b border-zinc-700 pb-4">
                <h3 className="text-lg font-semibold mb-2 text-zinc-100">Que faire si mon signalement n'est pas traité ?</h3>
                <p className="text-zinc-300">
                  Si votre signalement n'est pas traité dans les délais annoncés, contactez-nous via la page
                  <a href="/app/contact" className="text-blue-400 hover:underline ml-1">contact</a> en précisant la référence
                  de votre signalement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-zinc-100">Puis-je suivre l'état de mon signalement ?</h3>
                <p className="text-zinc-300">
                  Actuellement, nous n'offrons pas de système de suivi en temps réel. Vous serez informé par email
                  de l'issue de votre signalement si vous avez fourni une adresse email valide.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}