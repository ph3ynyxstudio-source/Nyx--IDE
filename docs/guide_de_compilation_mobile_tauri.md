📱 Guide de Survie : Tauri sur Android (Nyx IDE)

Ce document référence les commandes et astuces pour compiler et déboguer l'application Tauri sur un téléphone physique (ex: Nothing Phone), particulièrement utile quand le téléphone est sur réseau cellulaire (LTE/5G) et le PC sur un autre réseau.

1. Préparation du Téléphone

Pour éviter les conflits de réseau et forcer la communication par câble :

Aller dans Paramètres > Options pour les développeurs.

Désactiver le "Débogage sans fil" (Wireless debugging).

Activer le "Débogage USB".

Brancher le téléphone au PC (Mode PTP / Transfert de photos recommandé si ça bloque).

2. Initialisation de la Connexion (ADB)

Si le téléphone n'est pas détecté, réinitialiser le pont de communication :

# 1. Fermer le processus ADB en arrière-plan
adb kill-server

# 2. Relancer et lister les appareils (Accepter la popup RSA sur le téléphone !)
adb devices


Attendu : Le numéro de série du téléphone avec le mot device.

3. Le Pont Réseau (La Magie USB)

Puisque le téléphone et le PC ne sont pas sur le même réseau Wi-Fi, il faut forcer le trafic web de Vite (port 1420) à passer directement dans le câble USB :

adb reverse tcp:1420 tcp:1420


Note : À refaire à chaque fois que tu débranches/rebranches le téléphone.

4. Lancement en Mode Développement

Lancer l'application en forçant Tauri à utiliser l'adresse locale (127.0.0.1) pour qu'il emprunte le pont USB créé à l'étape précédente :

pnpm tauri android dev --host 127.0.0.1


Résultat : L'app s'installe et l'interface Vite charge instantanément sans erreur de "timeout" ni crash de "destroyed mutex".

5. Compilation pour la Production (APK)

Quand le code est prêt à être distribué ou testé sans le câble :

# Générer un APK universel (se trouve dans src-tauri/gen/android/app/build/outputs/apk/)
pnpm tauri android build

# Générer un APK pour une architecture spécifique (ex: arm64 pour les téléphones récents)
pnpm tauri android build --target aarch64


🛠️ Astuces VS Code (Mémo)

Erreur Untrusted schema dans tauri.conf.json :
Ouvrir la palette de commandes (Ctrl+Shift+P), chercher "Manage Trusted Domains" et ajouter https://*.tauri.app. Recharger la fenêtre.

Inlay Hints (Implicit Drops) en Rust :
Dans les paramètres VS Code (Ctrl+,), chercher "implicitDrops" et régler sur with_drop_glue (ou false si le serveur rust-analyzer exige un booléen strict sur ta version).