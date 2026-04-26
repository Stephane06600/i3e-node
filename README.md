# SARL I3E — Site Node.js

Site vitrine SARL I3E — Installation Photovoltaïque — Node.js / Express.

## Structure

```
i3e-node/
├── server.js           ← Serveur Express (routes + formulaire)
├── package.json        ← Dépendances Node.js
├── .gitignore
├── public/
│   ├── index.html      ← Page principale
│   ├── css/style.css
│   └── js/main.js
└── README.md
```

## Variables d'environnement (à configurer sur Hostinger)

| Variable    | Valeur                  |
|-------------|-------------------------|
| SMTP_HOST   | smtp.sfr.fr             |
| SMTP_PORT   | 465                     |
| SMTP_USER   | i3e@sfr.fr              |
| SMTP_PASS   | votre_mot_de_passe_sfr  |
| PORT        | (défini par Hostinger)  |

## Déploiement Hostinger via GitHub → voir README ci-dessous
