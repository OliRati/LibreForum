export default function Moderation() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold mb-6">Règles de Modération</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Principes généraux</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                LibreForum est une communauté où le respect mutuel et la liberté d'expression sont les valeurs fondatrices.
                Pour maintenir un environnement sain et constructif, nous avons établi des règles claires que tous les utilisateurs
                doivent respecter.
              </p>
              <p>
                La modération est assurée par une équipe bénévole qui veille au respect de ces règles.
                Les décisions de modération sont prises de manière collégiale et peuvent faire l'objet d'appel.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contenus interdits</h2>
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Contenus illégaux</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300">
                  <li>Apologie de crimes ou d'actes terroristes</li>
                  <li>Incitation à la haine raciale, religieuse ou discriminatoire</li>
                  <li>Contenus pédopornographiques ou exploitation sexuelle des mineurs</li>
                  <li>Diffusion de données personnelles sans consentement</li>
                  <li>Contrefaçon et violation de droits d'auteur</li>
                </ul>
              </div>

              <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-orange-400">Harcèlement et comportements toxiques</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300">
                  <li>Insultes, menaces ou harcèlement</li>
                  <li>Discrimination basée sur l'origine, le genre, l'orientation sexuelle</li>
                  <li>Doxing ou révélation d'informations personnelles</li>
                  <li>Spam ou messages répétitifs sans valeur ajoutée</li>
                  <li>Trolling systématique et provocation</li>
                </ul>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Contenus inappropriés</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-300">
                  <li>Contenus pornographiques ou à caractère sexuel explicite</li>
                  <li>Violence graphique ou descriptions détaillées de violence</li>
                  <li>Contenus choquants ou gore</li>
                  <li>Publicité non sollicitée ou arnaques</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Règles de conduite</h2>
            <div className="space-y-4 text-zinc-300">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Respect et courtoisie</h3>
                <p>
                  Traitez les autres membres avec respect. Les désaccords sont acceptés mais doivent rester constructifs.
                  Évitez les attaques personnelles et concentrez-vous sur les idées.
                </p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Pertinence des sujets</h3>
                <p>
                  Créez des sujets dans les catégories appropriées. Les titres doivent être clairs et descriptifs.
                  Évitez les sujets dupliqués ou hors-sujet.
                </p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Langage approprié</h3>
                <p>
                  Utilisez un langage correct et compréhensible. Évitez le langage SMS excessif ou les abréviations
                  qui rendent les messages difficiles à lire.
                </p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Confidentialité</h3>
                <p>
                  Respectez la vie privée des autres membres. Ne partagez pas d'informations personnelles sans
                  consentement explicite.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sanctions</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                En cas de violation des règles, différentes sanctions peuvent être appliquées selon la gravité
                et la récidive :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-400">Sanctions mineures</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Avertissement</li>
                    <li>Suppression de message</li>
                    <li>Modification de message</li>
                  </ul>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Sanctions majeures</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Suspension temporaire du compte</li>
                    <li>Bannissement définitif</li>
                    <li>Suppression de compte</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Procédure d'appel</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Si vous estimez qu'une sanction a été appliquée injustement, vous pouvez faire appel :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>Contactez l'équipe de modération via la page <a href="/app/contact" className="text-blue-400 hover:underline">contact</a></li>
                <li>Expliquez clairement les raisons de votre appel</li>
                <li>Fournissez des éléments de contexte si nécessaire</li>
                <li>La décision d'appel sera prise dans un délai de 7 jours</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Signalement</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Pour signaler un contenu qui ne respecte pas ces règles :
              </p>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <p className="mb-2">
                  <strong>Comment signaler :</strong>
                </p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Cliquez sur le bouton "Signaler" sous le message concerné</li>
                  <li>Sélectionnez le motif approprié</li>
                  <li>Ajoutez une description détaillée</li>
                  <li>Notre équipe traitera le signalement rapidement</li>
                </ol>
              </div>

              <p>
                Vous pouvez également consulter la page dédiée au <a href="/app/signalement" className="text-blue-400 hover:underline">signalement</a>
                pour plus d'informations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}