import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

type PasswordValidationRule = {
    key: string;
    label: string;
    test: (password: string) => boolean;
};

const passwordValidationRules: PasswordValidationRule[] = [
    {
        key: "minLength",
        label: "12 caractères minimum",
        test: (password) => password.length >= 12,
    },
    {
        key: "uppercase",
        label: "Au moins une majuscule",
        test: (password) => /[A-Z]/.test(password),
    },
    {
        key: "lowercase",
        label: "Au moins une minuscule",
        test: (password) => /[a-z]/.test(password),
    },
    {
        key: "digit",
        label: "Au moins un chiffre",
        test: (password) => /[0-9]/.test(password),
    },
    {
        key: "specialChar",
        label: "Au moins un caractère spécial",
        test: (password) => /[!@#$%^&*()_+\-=\[\]{};:'",.<>?\\|`~]/.test(password),
    },
];

export function isPasswordValid(password: string): boolean {
    return passwordValidationRules.every((rule) => rule.test(password));
}

export function getPasswordValidationStates(password: string) {
    return passwordValidationRules.map((rule) => ({
        ...rule,
        valid: rule.test(password),
    }));
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
    return password !== "" && password === confirmPassword;
}

interface PasswordInputGroupProps {
    password: string;
    confirmPassword: string;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    passwordLabel?: string;
    confirmLabel?: string;
    passwordPlaceholder?: string;
    confirmPlaceholder?: string;
}

export default function PasswordInputGroup({
    password,
    confirmPassword,
    onPasswordChange,
    onConfirmPasswordChange,
    passwordLabel = "Mot de passe",
    confirmLabel = "Confirmation du mot de passe",
    passwordPlaceholder = "Mot de passe",
    confirmPlaceholder = "Confirmer le mot de passe",
}: PasswordInputGroupProps) {
    const validationStates = getPasswordValidationStates(password);
    const passwordValid = isPasswordValid(password);
    const match = passwordsMatch(password, confirmPassword);

    return (
        <>
            <label className="block text-sm text-zinc-400">
                {passwordLabel}
                <input
                    type="password"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    className={`w-full rounded bg-zinc-800 px-4 py-3 text-zinc-100 outline-none${passwordLabel !== "" ? " mt-2" : ""}`}
                    placeholder={passwordPlaceholder}
                    aria-invalid={password !== "" && !passwordValid}
                />

                {password !== "" && (
                    <div className="mt-3 space-y-2 text-sm">
                        {validationStates.map((rule) => (
                            <div key={rule.key} className="flex items-center gap-2">
                                {rule.valid ? (
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                    <XCircleIcon className="h-4 w-4 text-red-500" />
                                )}
                                <span className={rule.valid ? "text-green-400" : "text-red-400"}>{rule.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </label>

            <label className="block text-sm text-zinc-400">
                {confirmLabel}
                <div className="relative">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => onConfirmPasswordChange(event.target.value)}
                        className={`w-full rounded bg-zinc-800 px-4 py-3 pr-12 text-zinc-100 outline-none${confirmLabel !== "" ? " mt-2" : ""}`}
                        placeholder={confirmPlaceholder}
                        aria-invalid={confirmPassword !== "" && !match}
                    />
                    {confirmPassword !== "" && (
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            {match ? (
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : (
                                <XCircleIcon className="h-6 w-6 text-red-500" />
                            )}
                        </div>
                    )}
                </div>
            </label>
        </>
    );
}
