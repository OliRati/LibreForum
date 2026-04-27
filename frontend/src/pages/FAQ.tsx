export default function FAQ() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 p-6">
        <h1 className="text-3xl font-bold mb-6">Foire Aux Questions</h1>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-6">
            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Qu'est-ce que LibreForum ?</h2>
              <p className="text-zinc-300">
                LibreForum est une plateforme de discussion en ligne libre et ouverte où les utilisateurs peuvent créer des sujets de discussion,
                partager des idées et débattre de manière constructive sur divers thèmes.
              </p>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment créer un compte ?</h2>
              <p className="text-zinc-300 mb-3">
                Pour créer un compte sur LibreForum :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-zinc-300">
                <li>Cliquez sur "Inscription" dans le menu</li>
                <li>Remplissez le formulaire avec votre nom d'utilisateur, email et mot de passe</li>
                <li>Acceptez les conditions générales d'utilisation</li>
                <li>Cliquez sur "S'inscrire"</li>
              </ol>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment créer un nouveau sujet ?</h2>
              <p className="text-zinc-300 mb-3">
                Pour créer un nouveau sujet :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-zinc-300">
                <li>Connectez-vous à votre compte</li>
                <li>Cliquez sur "Nouveau sujet" dans le menu</li>
                <li>Choisissez une catégorie appropriée</li>
                <li>Donnez un titre clair et descriptif à votre sujet</li>
                <li>Rédigez votre message en respectant la charte de modération</li>
                <li>Cliquez sur "Publier"</li>
              </ol>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment signaler un contenu inapproprié ?</h2>
              <p className="text-zinc-300 mb-3">
                Si vous rencontrez un contenu qui ne respecte pas nos règles :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-zinc-300">
                <li>Cliquez sur le bouton "Signaler" sous le message concerné</li>
                <li>Sélectionnez le motif du signalement</li>
                <li>Ajoutez une description détaillée si nécessaire</li>
                <li>Notre équipe de modération examinera le signalement dans les plus brefs délais</li>
              </ol>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Quelles sont les règles de modération ?</h2>
              <p className="text-zinc-300 mb-3">
                Les règles de modération sont disponibles sur la page dédiée :
              </p>
              <a href="/app/moderation" className="text-blue-400 hover:underline">
                Consulter les règles de modération
              </a>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment modifier mon profil ?</h2>
              <p className="text-zinc-300 mb-3">
                Pour modifier votre profil :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-zinc-300">
                <li>Cliquez sur votre nom d'utilisateur dans le menu</li>
                <li>Accédez à votre profil</li>
                <li>Cliquez sur "Modifier le profil"</li>
                <li>Modifiez les informations souhaitées</li>
                <li>Enregistrez les changements</li>
              </ol>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment rechercher des sujets ?</h2>
              <p className="text-zinc-300 mb-3">
                Utilisez la barre de recherche en haut de la page :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-300">
                <li>Saisissez des mots-clés dans la barre de recherche</li>
                <li>La recherche parcourt les titres et le contenu des messages</li>
                <li>Utilisez les filtres pour affiner les résultats</li>
              </ul>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">J'ai oublié mon mot de passe, que faire ?</h2>
              <p className="text-zinc-300 mb-3">
                Si vous avez oublié votre mot de passe :
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-zinc-300">
                <li>Cliquez sur "Connexion" puis "Mot de passe oublié"</li>
                <li>Saisissez l'adresse email associée à votre compte</li>
                <li>Un email de réinitialisation vous sera envoyé</li>
                <li>Suivez les instructions dans l'email pour créer un nouveau mot de passe</li>
              </ol>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Comment contacter l'équipe de modération ?</h2>
              <p className="text-zinc-300 mb-3">
                Pour contacter l'équipe de modération :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-zinc-300">
                <li>Utilisez le système de signalement intégré pour les contenus problématiques</li>
                <li>Pour les autres demandes, consultez la page <a href="/app/contact" className="text-blue-400 hover:underline">contact</a></li>
                <li>Email : moderation@libreforum.local</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-zinc-100">Vous n'avez pas trouvé la réponse à votre question ?</h2>
              <p className="text-zinc-300 mb-3">
                Si votre question n'est pas traitée dans cette FAQ, n'hésitez pas à nous contacter :
              </p>
              <a href="/app/contact" className="text-blue-400 hover:underline">
                Page de contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}