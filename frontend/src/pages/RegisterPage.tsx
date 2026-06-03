import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValid = email.trim().length > 0 && emailRegex.test(email) && email.length <= 180;
  const usernameIsValid = username.trim().length >= 3 && username.trim().length <= 50;
  const displayNameIsValid = displayName.trim().length >= 3 && displayName.trim().length <= 50;
  
  // Password validation
  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};:'",./<>?\\|`~]/.test(password);
  const passwordIsValid = hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
  
  const passwordsMatch = password && passwordConfirm && password === passwordConfirm && passwordIsValid;
  const formIsValid = emailIsValid && usernameIsValid && displayNameIsValid && passwordsMatch && accepted;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailIsValid) {
      setError("Email invalide ou trop long.");
      return;
    }

    if (!usernameIsValid) {
      setError("Nom d'utilisateur invalide (3-50 caractères).");
      return;
    }

    if (!passwordIsValid) {
      const missing = [];
      if (!hasMinLength) missing.push("12 caractères minimum");
      if (!hasUppercase) missing.push("une majuscule");
      if (!hasLowercase) missing.push("une minuscule");
      if (!hasDigit) missing.push("un chiffre");
      if (!hasSpecialChar) missing.push("un caractère spécial");
      setError("Le mot de passe doit contenir: " + missing.join(", "));
      return;
    }

    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!accepted) {
      setError("Vous devez accepter les CGU pour vous inscrire sur ce site");
      return;
    }

    try {
      await register({
        email,
        username,
        password,
        displayName,
      });

      navigate("/login");
    } catch {
      setError("Impossible de créer le compte.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 p-6">
      <h1 className="mb-6 text-2xl font-bold">Inscription</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!emailIsValid && email.length > 0}
        />
        {!emailIsValid && email.length > 0 && (
          <p className="text-sm text-red-400">Email invalide ou trop long.</p>
        )}

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!usernameIsValid && username.length > 0}
        />
        {!usernameIsValid && username.length > 0 && (
          <p className="text-sm text-red-400">Nom d'utilisateur requis (3-50 caractères).</p>
        )}

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          placeholder="Nom affiché"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          aria-invalid={!displayNameIsValid && displayName.length > 0}
        />
        {!displayNameIsValid && displayName.length > 0 && (
          <p className="text-sm text-red-400">Nom affiché invalide (3-50 caractères).</p>
        )}

        <div>
          <input
            className="w-full rounded bg-zinc-800 px-4 py-3"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!passwordIsValid && password.length > 0}
          />
          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {hasMinLength ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={hasMinLength ? "text-green-400" : "text-red-400"}>12 caractères minimum</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasUppercase ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={hasUppercase ? "text-green-400" : "text-red-400"}>Au moins une majuscule</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasLowercase ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={hasLowercase ? "text-green-400" : "text-red-400"}>Au moins une minuscule</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasDigit ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={hasDigit ? "text-green-400" : "text-red-400"}>Au moins un chiffre</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasSpecialChar ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={hasSpecialChar ? "text-green-400" : "text-red-400"}>Au moins un caractère spécial</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            className="w-full rounded bg-zinc-800 px-4 py-3 pr-12"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          {passwordConfirm && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {password !== passwordConfirm ? (
                <XCircleIcon className="h-7 w-7 text-red-500" />
              ) : (
                <CheckCircleIcon className="h-7 w-7 text-green-500" />
              )}
            </div>
          )}
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-800"
          />
          <span className="text-sm text-zinc-300">J'accepte les <Link to="/cgu" className="text-blue-400 hover:underline">Conditions Générales d'Utilisation</Link></span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!formIsValid}
          className="w-full rounded bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:opacity-60"
        >
          Créer un compte
        </button>
      </form>
    </div>
  );
}