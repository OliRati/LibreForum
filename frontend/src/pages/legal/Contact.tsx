export default function Contact() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Pour toute question, suggestion ou signalement, vous pouvez nous contacter :
              </p>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p>contact@libreforum.local</p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Support technique</h3>
                <p>support@libreforum.local</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Pour les problèmes techniques ou les bugs
                </p>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Modération</h3>
                <p>moderation@libreforum.local</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Pour signaler un contenu inapproprié
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Délais de réponse</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Nous nous efforçons de répondre à tous les messages dans les meilleurs délais :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Questions générales : 24-48 heures</li>
                <li>Problèmes techniques : 12-24 heures</li>
                <li>Signalements de modération : 6-12 heures</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Avant de nous contacter</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Avant de nous envoyer un message, nous vous invitons à consulter :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>La <a href="/app/faq" className="text-blue-400 hover:underline">FAQ</a> pour les questions fréquentes</li>
                <li>Les <a href="/app/cgu" className="text-blue-400 hover:underline">conditions d'utilisation</a></li>
                <li>La <a href="/app/moderation" className="text-blue-400 hover:underline">charte de modération</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}