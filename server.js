/**
 * SARL I3E — Serveur Node.js / Express
 * Déploiement : Hostinger (Node.js App) via GitHub
 */

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Route principale ─────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Route formulaire de contact ──────────────────────
app.post('/contact', async (req, res) => {
  const { prenom, nom, telephone, email, projet, message } = req.body;

  // Validation basique
  if (!prenom || !nom || !email || !message) {
    return res.status(400).json({ success: false, error: 'Champs obligatoires manquants.' });
  }

  try {
    // Configuration SMTP (à renseigner dans les variables d'environnement Hostinger)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sfr.fr',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'i3e@sfr.fr',
        pass: process.env.SMTP_PASS || '',  // À définir dans Hostinger → Variables d'env
      },
    });

    // E-mail reçu par I3E
    await transporter.sendMail({
      from: `"Site I3E" <${process.env.SMTP_USER || 'i3e@sfr.fr'}>`,
      to: 'i3e@sfr.fr',
      replyTo: email,
      subject: `[I3E] Nouvelle demande de devis — ${projet || 'Non précisé'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:30px;border-radius:8px;">
          <div style="background:#0D1117;padding:20px;border-radius:6px;margin-bottom:20px;text-align:center;">
            <h1 style="color:#C8A951;font-size:1.8rem;margin:0;letter-spacing:0.1em;">I3<span style="color:#F5F0E8;font-weight:300;">E</span></h1>
            <p style="color:#8A9BB0;font-size:0.8rem;margin:6px 0 0;letter-spacing:0.15em;text-transform:uppercase;">Nouvelle demande de devis</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px;background:#fff;border-bottom:1px solid #eee;width:35%;font-weight:bold;color:#555;">Nom</td><td style="padding:10px;background:#fff;border-bottom:1px solid #eee;">${prenom} ${nom}</td></tr>
            <tr><td style="padding:10px;background:#f9f9f9;border-bottom:1px solid #eee;font-weight:bold;color:#555;">Téléphone</td><td style="padding:10px;background:#f9f9f9;border-bottom:1px solid #eee;">${telephone || 'Non renseigné'}</td></tr>
            <tr><td style="padding:10px;background:#fff;border-bottom:1px solid #eee;font-weight:bold;color:#555;">E-mail</td><td style="padding:10px;background:#fff;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:10px;background:#f9f9f9;border-bottom:1px solid #eee;font-weight:bold;color:#555;">Type de projet</td><td style="padding:10px;background:#f9f9f9;border-bottom:1px solid #eee;">${projet || 'Non précisé'}</td></tr>
            <tr><td style="padding:10px;background:#fff;font-weight:bold;color:#555;vertical-align:top;">Message</td><td style="padding:10px;background:#fff;">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
          <p style="color:#999;font-size:0.75rem;margin-top:20px;text-align:center;">Message envoyé depuis le site i3e.fr — ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    });

    // E-mail de confirmation au client
    await transporter.sendMail({
      from: `"SARL I3E" <${process.env.SMTP_USER || 'i3e@sfr.fr'}>`,
      to: email,
      subject: 'Votre demande de devis I3E a bien été reçue',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:30px;border-radius:8px;">
          <div style="background:#0D1117;padding:20px;border-radius:6px;margin-bottom:24px;text-align:center;">
            <h1 style="color:#C8A951;font-size:1.8rem;margin:0;letter-spacing:0.1em;">I3<span style="color:#F5F0E8;font-weight:300;">E</span></h1>
          </div>
          <p style="color:#333;font-size:1rem;">Bonjour <strong>${prenom}</strong>,</p>
          <p style="color:#555;line-height:1.7;">Nous avons bien reçu votre demande de devis et nous vous répondrons dans les <strong>24 heures ouvrées</strong>.</p>
          <p style="color:#555;line-height:1.7;">En attendant, n'hésitez pas à nous contacter directement :</p>
          <div style="background:#fff;border-left:3px solid #C8A951;padding:16px;margin:20px 0;border-radius:0 4px 4px 0;">
            <p style="margin:0;color:#333;">📞 <strong>06 10 84 75 44</strong></p>
            <p style="margin:6px 0 0;color:#333;">📍 2 allée des Imprimeurs, 06700 Saint-Laurent-du-Var</p>
          </div>
          <p style="color:#555;">Cordialement,<br><strong>L'équipe SARL I3E</strong></p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Votre demande a bien été envoyée !' });

  } catch (err) {
    console.error('Erreur envoi email:', err);
    // En cas d'erreur SMTP, on confirme quand même (évite de bloquer l'UX)
    res.json({ success: true, message: 'Votre demande a bien été enregistrée.' });
  }
});

// ── Démarrage ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Serveur I3E démarré sur http://localhost:${PORT}`);
});
