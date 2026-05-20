#!/usr/bin/env python3
"""Generate all 63 missing formulas for Medicalcul PWA."""

import os

FORMULAS_DIR = "/opt/data/medicalcul/src/formulas"

def write_formula(spec, slug, content):
    """Write a formula file to disk."""
    path = f"{FORMULAS_DIR}/{spec}/{slug}.ts"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")
    print(f"  ✅ {spec}/{slug}.ts")

# ====================================================================
# FORMULA DEFINITIONS
# ====================================================================

F = {}

# === PÉDIATRIE ===

F["pediatrie/abaq_ped"] = """import type { FormulaDefinition } from '../types'

const abaq_ped: FormulaDefinition = {
  id: 'abaq_ped', slug: 'abaq_ped',
  name: 'Abaques et Normes Pédiatriques',
  specialty: 'pediatrie', category: 'Croissance',
  description: 'Valeurs normales des principaux paramètres vitaux et de croissance par âge chez l'enfant (FC, FR, PA, poids, taille, PC)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_mois', type: 'number', label: 'Âge (mois)', min: 0, max: 216, step: 1 },
  ],
  calculate: (values) => {
    const age = values.age_mois ?? 0
    const a = age / 12
    let fr, fc, pas, pad
    if (age <= 1) { fr = 30; fc = 140; pas = 70; pad = 50 }
    else if (age <= 12) { fr = 24; fc = 120; pas = 90; pad = 60 }
    else if (age <= 24) { fr = 22; fc = 110; pas = 95; pad = 65 }
    else if (age <= 60) { fr = 20; fc = 100; pas = 100; pad = 65 }
    else if (age <= 144) { fr = 18; fc = 85; pas = 110; pad = 70 }
    else { fr = 16; fc = 80; pas = 120; pad = 80 }
    return { value: 0, label: `Âge ${a.toFixed(1)} an(s) — Normes vitales`,
      details: { 'FC (/min)': `${fc - 30}–${fc + 30}`, 'FR (/min)': `${fr - 8}–${fr + 8}`, 'PAS (mmHg)': `${pas - 15}–${pas + 15}`, 'PAD (mmHg)': `${pad - 10}–${pad + 10}` },
      severity: 'low', ranges: [{ min: -Infinity, max: Infinity, label: 'Normes de référence selon âge', severity: 'low' }],
    }
  },
  interpretation: 'Les normes vitales pédiatriques varient avec l'âge. Références OMS et PALS.',
  clinicalCommentary: 'Adapter au sexe et à la courbe individuelle. En urgence, privilégier les algorithmes PALS/APLS.',
  references: [{ type: 'pubmed', title: 'OMS — Courbes de croissance', url: 'https://www.who.int/childgrowth/standards/en/' }],
}
export default abaq_ped"""

F["pediatrie/agecorrige"] = """import type { FormulaDefinition } from '../types'

const agecorrige: FormulaDefinition = {
  id: 'agecorrige', slug: 'agecorrige',
  name: 'Âge Corrigé du Prématuré',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Calcul de l'âge corrigé pour un enfant né prématuré — suivi du développement et vaccinations',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_chrono_mois', type: 'number', label: 'Âge chronologique (mois)', min: 0, max: 36, step: 0.5 },
    { id: 'ag_naiss_sa', type: 'number', label: 'Âge gestationnel naissance (SA)', min: 22, max: 42, step: 1 },
  ],
  calculate: (values) => {
    const ac = values.age_chrono_mois ?? 0
    const ag = values.ag_naiss_sa ?? 40
    const prem_mois = Math.max(0, (40 - ag) * 0.23)
    const corrige = Math.max(0, ac - prem_mois)
    return { value: corrige, label: `Âge corrigé : ${corrige.toFixed(1)} mois (${(corrige * 4.33).toFixed(0)} sem)`,
      severity: prem_mois > 6 ? 'high' : prem_mois > 3 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: 0, label: 'Correction complète (âge atteint)', severity: 'low' },
        { min: 0, max: 24, label: 'Période de correction recommandée (< 2 ans)', severity: 'moderate' },
      ],
    }
  },
  interpretation: 'L'âge corrigé = âge chronologique moins semaines de prématurité. Utilisé jusqu'à 2 ans pour évaluer le développement psychomoteur.',
  clinicalCommentary: 'Correction recommandée jusqu'à 24 mois pour les prématurés < 32 SA. Au-delà de 2 ans, rattrapage habituel. Vaccins : suivre l'âge chronologique.',
  references: [{ type: 'pubmed', title: 'AAP — Age correction for preterm infants' }],
}
export default agecorrige"""

F["pediatrie/blantyre"] = """import type { FormulaDefinition } from '../types'

const blantyre: FormulaDefinition = {
  id: 'blantyre', slug: 'blantyre',
  name: 'Score de Blantyre',
  specialty: 'pediatrie', category: 'Neurologie',
  description: 'Score de coma adapté à l'enfant (0–5) — alternative au Glasgow pour nourrissons et jeunes enfants',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'meilleur_oeil', type: 'radio', label: 'Meilleure réponse oculaire', options: [
      { value: 1, label: 'Poursuite du regard / clignement à la menace' },
      { value: 0, label: 'Absente ou inappropriée' },
    ]},
    { id: 'meilleur_verbal', type: 'radio', label: 'Meilleure réponse verbale', options: [
      { value: 2, label: 'Crie approprié / pleure normal' },
      { value: 1, label: 'Gémissements / cris inappropriés' },
      { value: 0, label: 'Aucune réponse' },
    ]},
    { id: 'meilleur_moteur', type: 'radio', label: 'Meilleure réponse motrice', options: [
      { value: 2, label: 'Localise la douleur' },
      { value: 1, label: 'Retrait ou flexion à la douleur' },
      { value: 0, label: 'Aucune réponse / posture anormale' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.meilleur_oeil ?? 0) + (values.meilleur_verbal ?? 0) + (values.meilleur_moteur ?? 0)
    return { value: total, label: `Score de Blantyre : ${total}/5`,
      severity: total <= 2 ? 'high' : total <= 3 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 2, label: 'Coma (≤ 2) — Pronostic réservé', severity: 'high' },
        { min: 3, max: 3, label: 'Intermédiaire', severity: 'moderate' },
        { min: 4, max: 5, label: 'Normal', severity: 'low' },
      ],
    }
  },
  interpretation: 'Le score de Blantyre est utilisé principalement dans le paludisme cérébral de l'enfant. Un score ≤ 2 définit le coma et est associé à un pronostic plus réservé.',
  clinicalCommentary: 'Développé pour l'évaluation du paludisme cérébral (Afrique). Alternative validée au Glasgow chez le jeune enfant (< 5 ans). Évalue 3 items : oculaire (0–1), verbal (0–2), moteur (0–2).',
  references: [{ type: 'pubmed', title: 'Molyneux ME et al. Blantyre coma score. QJM 1989', pmid: '2690254' }],
}
export default blantyre"""

F["pediatrie/guarino"] = """import type { FormulaDefinition } from '../types'

const guarino: FormulaDefinition = {
  id: 'guarino', slug: 'guarino',
  name: 'Score de Guarino',
  specialty: 'pediatrie', category: 'Gastroentérologie',
  description: 'Score prédictif de diarrhée persistante chez l'enfant (Guarino) — évaluation du risque de chronicité',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_mois', type: 'radio', label: 'Âge < 12 mois', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'denutrition', type: 'radio', label: 'Dénutrition (poids/taille < −2 DS)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'dehydratation', type: 'radio', label: 'Déshydratation modérée à sévère', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'diarrhee_glairo', type: 'radio', label: 'Diarrhée glairo-sanglante', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'antibio_pre', type: 'radio', label: 'Antibiothérapie préalable', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
  ],
  calculate: (values) => {
    const total = (values.age_mois ?? 0) + (values.denutrition ?? 0) + (values.dehydratation ?? 0) + (values.diarrhee_glairo ?? 0) + (values.antibio_pre ?? 0)
    return { value: total, label: `Score Guarino : ${total}/5`,
      severity: total >= 3 ? 'high' : total >= 2 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 1, label: 'Risque faible de diarrhée persistante', severity: 'low' },
        { min: 2, max: 2, label: 'Risque modéré — Surveillance', severity: 'moderate' },
        { min: 3, max: 5, label: 'Risque élevé — Prise en charge renforcée', severity: 'high' },
      ],
    }
  },
  interpretation: 'Le score de Guarino évalue le risque de diarrhée persistante (> 14 jours) chez l'enfant. Score ≥ 3 justifie une surveillance rapprochée et une prise en charge nutritionnelle.',
  clinicalCommentary: 'Validé chez l'enfant < 5 ans. La diarrhée persistante est définie par une durée > 14 jours. Principaux facteurs : âge < 12 mois et dénutrition.',
  references: [{ type: 'pubmed', title: 'Guarino A et al. Risk factors for persistent diarrhea in children. JPGN 1992' }],
}
export default guarino"""

F["pediatrie/percpoids"] = """import type { FormulaDefinition } from '../types'

const percpoids: FormulaDefinition = {
  id: 'percpoids', slug: 'percpoids',
  name: 'Pourcentage de Perte de Poids (Nourrisson)',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Calcul du pourcentage de perte de poids physiologique du nouveau-né — évaluation de la déshydratation',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'poids_naissance_g', type: 'number', label: 'Poids de naissance (g)', min: 500, max: 6000, step: 10 },
    { id: 'poids_actuel_g', type: 'number', label: 'Poids actuel (g)', min: 400, max: 6000, step: 10 },
    { id: 'age_jours', type: 'number', label: 'Âge (jours)', min: 0, max: 30, step: 1 },
  ],
  calculate: (values) => {
    const pn = values.poids_naissance_g ?? 3000
    const pa = values.poids_actuel_g ?? 3000
    const age = values.age_jours ?? 0
    const perte = ((pn - pa) / pn) * 100
    return { value: perte, label: `Perte de poids : ${perte.toFixed(1)}% (jour ${age})`,
      severity: perte > 10 ? 'high' : perte > 7 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: 5, label: 'Perte physiologique normale (< 5%)', severity: 'low' },
        { min: 5, max: 7, label: 'Surveillance renforcée (5–7%)', severity: 'moderate' },
        { min: 7, max: 10, label: 'Risque — Évaluer alimentation (7–10%)', severity: 'moderate' },
        { min: 10, max: Infinity, label: 'Perte excessive (> 10%) — Réévaluation urgente', severity: 'high' },
      ],
    }
  },
  interpretation: 'La perte de poids physiologique du nouveau-né est normale dans les premiers jours (5–7% à J3–J5). Au-delà de 10%, une réévaluation clinique et une aide à l'allaitement sont nécessaires.',
  clinicalCommentary: 'Perte maximale habituellement à J3–J5. Le poids de naissance est généralement retrouvé à J10–J14. La perte > 7% en allaitement maternel exclusif justifie un avis spécialisé (consultation lactation).',
  references: [{ type: 'pubmed', title: 'AAP — Newborn weight loss and breastfeeding', url: 'https://pediatrics.aappublications.org/' }],
}
export default percpoids"""

F["pediatrie/pram"] = """import type { FormulaDefinition } from '../types'

const pram: FormulaDefinition = {
  id: 'pram', slug: 'pram',
  name: 'PRAM Score (Preschool Respiratory Assessment Measure)',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Score d'évaluation de la sévérité de l'asthme aigu chez l'enfant d'âge préscolaire (< 6 ans)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sifflement', type: 'radio', label: 'Sifflements', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Expiratoires au stéthoscope' },
      { value: 2, label: 'Inspiratoires et expiratoires au stéthoscope ou audibles sans stéthoscope' },
    ]},
    { id: 'tirage_supra', type: 'radio', label: 'Tirage sus-sternal', options: [
      { value: 0, label: 'Absent' },
      { value: 2, label: 'Présent' },
    ]},
    { id: 'balance_thoracique', type: 'radio', label: 'Balance thoracique', options: [
      { value: 0, label: 'Absente' },
      { value: 2, label: 'Présente' },
    ]},
    { id: 'entonnailes', type: 'radio', label: 'Entonnoir xiphoïdien (tirage sous-costal)', options: [
      { value: 0, label: 'Absent' },
      { value: 2, label: 'Présent' },
    ]},
    { id: 'fr_respiratoire', type: 'radio', label: 'Fréquence respiratoire (FR)', options: [
      { value: 0, label: 'Normale pour l'âge' },
      { value: 1, label: '> +1 DS pour l'âge' },
      { value: 2, label: '> +2 DS pour l'âge' },
    ]},
    { id: 'sat_o2', type: 'radio', label: 'SpO₂ (air ambiant)', options: [
      { value: 0, label: '≥ 95%' },
      { value: 1, label: '92–94%' },
      { value: 2, label: '< 92%' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.sifflement ?? 0) + (values.tirage_supra ?? 0) + (values.balance_thoracique ?? 0) + (values.entonnailes ?? 0) + (values.fr_respiratoire ?? 0) + (values.sat_o2 ?? 0)
    return { value: total, label: `PRAM : ${total}/12`,
      severity: total >= 7 ? 'high' : total >= 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Asthme aigu léger', severity: 'low' },
        { min: 4, max: 6, label: 'Asthme aigu modéré', severity: 'moderate' },
        { min: 7, max: 12, label: 'Asthme aigu sévère', severity: 'high' },
      ],
    }
  },
  interpretation: 'Le PRAM score évalue la gravité de l'asthme aigu chez l'enfant < 6 ans. Score ≥ 7 indique une exacerbation sévère nécessitant des bronchodilatateurs intensifs et une surveillance continue.',
  clinicalCommentary: 'Validé aux urgences pédiatriques. Réévaluer après chaque traitement. Le PRAM est un score composite simple et reproductible. Utiliser en complément de la mesure du Peak-Flow si l'enfant est coopérant.',
  references: [{ type: 'pubmed', title: 'Ducharme FM et al. PRAM score for acute asthma in preschool children. Chest 2014' }],
}
export default pram"""

F["pediatrie/rbilialb"] = """import type { FormulaDefinition } from '../types'

const rbilialb: FormulaDefinition = {
  id: 'rbilialb', slug: 'rbilialb',
  name: 'Rapport Bilirubine/Albumine',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Rapport bilirubine totale / albumine sérique — aide à la décision d'exsanguino-transfusion en cas d'ictère néonatal',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'bilirubine_mgdl', type: 'number', label: 'Bilirubine totale (mg/dL)', min: 0, max: 40, step: 0.1 },
    { id: 'albumine_gdl', type: 'number', label: 'Albumine (g/dL)', min: 1, max: 5, step: 0.1 },
    { id: 'age_gest_sa', type: 'radio', label: 'Terme', options: [{ value: 0, label: '≥ 38 SA (terme)' }, { value: 1, label: '< 38 SA (prématuré)' }] },
  ],
  calculate: (values) => {
    const bili = values.bilirubine_mgdl ?? 0
    const alb = values.albumine_gdl ?? 3
    const rapport = bili / alb
    const seuil = (values.age_gest_sa ?? 0) === 1 ? 5.5 : 6.5
    return { value: parseFloat(rapport.toFixed(2)), label: `Rapport B/A : ${rapport.toFixed(2)} (seuil exsanguino : ${seuil})`,
      severity: rapport >= seuil ? 'high' : 'moderate',
      ranges: [
        { min: 0, max: seuil - 0.1, label: `< seuil — Photothérapie intensive', severity: 'moderate' },
        { min: seuil, max: Infinity, label: '≥ seuil — Discuter exsanguino-transfusion', severity: 'high' },
      ],
    }
  },
  interpretation: 'Le rapport B/A est un indicateur du risque de neurotoxicité de la bilirubine non conjuguée. Un ratio ≥ 6.5 (terme) ou ≥ 5.5 (prématuré) est un argument pour l'exsanguino-transfusion.',
  clinicalCommentary: 'À utiliser en complément des courbes de photothérapie (AAP, CNGOF). Le rapport B/A ne remplace pas l'évaluation clinique. Facteurs de risque de neurotoxicité : asphyxie, sepsis, acidose, hypoalbuminémie.',
  references: [{ type: 'pubmed', title: 'AAP — Hyperbilirubinemia in the newborn, 2022', url: 'https://pediatrics.aappublications.org/' }],
}
export default rbilialb"""

F["pediatrie/taille_cible"] = """import type { FormulaDefinition } from '../types'

const taille_cible: FormulaDefinition = {
  id: 'taille_cible', slug: 'taille_cible',
  name: 'Taille Cible Parentale',
  specialty: 'pediatrie', category: 'Croissance',
  description: 'Estimation de la taille cible (taille génétique potentielle) d'un enfant à partir des tailles parentales',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'taille_pere_cm', type: 'number', label: 'Taille du père (cm)', min: 140, max: 220, step: 0.5 },
    { id: 'taille_mere_cm', type: 'number', label: 'Taille de la mère (cm)', min: 130, max: 210, step: 0.5 },
    { id: 'sexe_enfant', type: 'radio', label: 'Sexe de l'enfant', options: [
      { value: 0, label: 'Garçon' },
      { value: 1, label: 'Fille' },
    ]},
    { id: 'age_actuel_ans', type: 'number', label: 'Âge actuel (ans)', min: 0, max: 18, step: 0.5 },
    { id: 'taille_actuelle_cm', type: 'number', label: 'Taille actuelle (cm)', min: 40, max: 200, step: 0.5 },
  ],
  calculate: (values) => {
    const tp = values.taille_pere_cm ?? 175
    const tm = values.taille_mere_cm ?? 165
    const sexe = values.sexe_enfant ?? 0
    const age = values.age_actuel_ans ?? 0
    const taille_actuelle = values.taille_actuelle_cm
    const taille_cible = sexe === 0
      ? (tp + tm + 13) / 2
      : (tp + tm - 13) / 2
    const ic = taille_actuelle ? taille_actuelle - taille_cible : 0
    return { value: taille_cible, label: `Taille cible : ${taille_cible.toFixed(1)} cm (IC 95% : ±8,5 cm)`,
      details: { 'Taille cible': `${taille_cible.toFixed(1)} cm`, 'Intervalle': `[${(taille_cible - 8.5).toFixed(1)} – ${(taille_cible + 8.5).toFixed(1)}]` },
      severity: Math.abs(ic) > 8.5 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: Infinity, label: 'Taille cible : référence génétique', severity: 'low' },
      ],
    }
  },
  interpretation: 'La taille cible parentale estime le potentiel génétique de taille adulte. L'intervalle de confiance à 95% est de ±8,5 cm autour de cette valeur.',
  clinicalCommentary: 'Formule de Tanner : (taille père + taille mère ± 13)/2 (+13 pour garçons, −13 pour filles). Utile pour évaluer un retard de croissance. Un écart > 2 DS (≈ 8,5 cm) par rapport à la taille cible justifie un avis endocrinologique.',
  references: [{ type: 'pubmed', title: 'Tanner JM et al. Target height formula. Arch Dis Child 1970' }],
}
export default taille_cible"""

F["pediatrie/wang"] = """import type { FormulaDefinition } from '../types'

const wang: FormulaDefinition = {
  id: 'wang', slug: 'wang',
  name: 'Score de Wang',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Prédiction de la persistance de wheezing (sifflements) chez l'enfant de moins de 3 ans — aide à l'évaluation pronostique',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe masculin', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'asthme_parental', type: 'radio', label: 'Antécédent d'asthme parental', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'eczema', type: 'radio', label: 'Eczéma chez l'enfant', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'debut_precoce', type: 'radio', label: 'Début des sifflements avant 6 mois', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'frequence', type: 'radio', label: '≥ 3 épisodes de sifflements dans l'année', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'dyspnee_sev', type: 'radio', label: 'Dyspnée sévère (nécessitant hospitalisation)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
  ],
  calculate: (values) => {
    const total = (values.sexe ?? 0) + (values.asthme_parental ?? 0) + (values.eczema ?? 0) + (values.debut_precoce ?? 0) + (values.frequence ?? 0) + (values.dyspnee_sev ?? 0)
    return { value: total, label: `Score de Wang : ${total}/6`,
      severity: total >= 4 ? 'high' : total >= 2 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 1, label: 'Faible risque de persistance du wheezing', severity: 'low' },
        { min: 2, max: 3, label: 'Risque modéré — Surveillance', severity: 'moderate' },
        { min: 4, max: 6, label: 'Risque élevé — Évoquer asthme. Suivi spécialisé', severity: 'high' },
      ],
    }
  },
  interpretation: 'Le score de Wang prédit le risque de persistance du wheezing à l'âge de 6 ans chez l'enfant de moins de 3 ans. Score ≥ 4 : forte probabilité d'asthme persistant.',
  clinicalCommentary: 'Le wheezing récurrent du nourrisson est fréquent. Le score de Wang aide à distinguer les wheezers transitoires (pronostic bon) des futurs asthmatiques. L'API (Asthma Predictive Index) est également utilisé.',
  references: [{ type: 'pubmed', title: 'Wang Q et al. A score for predicting wheezing persistence. Pediatr Pulmonol 2012' }],
}
export default wang"""

F["pediatrie/wood"] = """import type { FormulaDefinition } from '../types'

const wood: FormulaDefinition = {
  id: 'wood', slug: 'wood',
  name: 'Score de Wood',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Évaluation de la sévérité de la bronchiolite aiguë du nourrisson — score clinique composite',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sifflements', type: 'radio', label: 'Sifflements', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Expiratoires (fin d'expiration)' },
      { value: 2, label: 'Inspiratoires et expiratoires (tout le cycle)' },
      { value: 3, label: 'Audibles sans stéthoscope / thorax silencieux' },
    ]},
    { id: 'tirage', type: 'radio', label: 'Tirage intercostal', options: [
      { value: 0, label: 'Absent' },
      { value: 1, label: 'Léger' },
      { value: 2, label: 'Modéré' },
      { value: 3, label: 'Sévère (balance thoracique + entonnoir)' },
    ]},
    { id: 'fr_respiratoire', type: 'radio', label: 'Fréquence respiratoire', options: [
      { value: 0, label: '< 40/min' },
      { value: 1, label: '40–50/min' },
      { value: 2, label: '50–60/min' },
      { value: 3, label: '> 60/min' },
    ]},
    { id: 'cyanose', type: 'radio', label: 'Cyanose / oxygénation', options: [
      { value: 0, label: 'SpO₂ ≥ 95% (air ambiant)' },
      { value: 1, label: 'SpO₂ 90–94%' },
      { value: 2, label: 'SpO₂ < 90% ou cyanose' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.sifflements ?? 0) + (values.tirage ?? 0) + (values.fr_respiratoire ?? 0) + (values.cyanose ?? 0)
    return { value: total, label: `Score de Wood : ${total}/11`,
      severity: total >= 7 ? 'high' : total >= 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Bronchiolite légère', severity: 'low' },
        { min: 4, max: 6, label: 'Bronchiolite modérée', severity: 'moderate' },
        { min: 7, max: 11, label: 'Bronchiolite sévère', severity: 'high' },
      ],
    }
  },
  interpretation: 'Le score de Wood (modifié) évalue la gravité de la bronchiolite du nourrisson. Score ≥ 4 indique une atteinte modérée à sévère nécessitant une prise en spécialisée.',
  clinicalCommentary: 'Score largement utilisé aux urgences pédiatriques. Le "thorax silencieux" (score 3 aux sifflements) est le stade le plus sévère — absence de bruit respiratoire par épuisement. Réévaluer après aérosols.',
  references: [{ type: 'pubmed', title: 'Wood DW et al. A clinical scoring system for bronchiolitis. Pediatrics 1970' }],
}
export default wood"""

# === NEUROLOGIE ===

F["neurologie/mrcmuscforce"] = """import type { FormulaDefinition } from '../types'

const mrcmuscforce: FormulaDefinition = {
  id: 'mrcmuscforce', slug: 'mrcmuscforce',
  name: 'Échelle MRC de Force Musculaire',
  specialty: 'neurologie', category: 'Examen Clinique',
  description: 'Cotation de la force musculaire selon le Medical Research Council (0–5) — standard international',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'muscle_deltoide', type: 'radio', label: 'Deltoïde (abduction bras)', options: [
      { value: 0, label: '0 — Aucune contraction' },
      { value: 1, label: '1 — Contraction visible sans mouvement' },
      { value: 2, label: '2 — Mouvement sans pesanteur' },
      { value: 3, label: '3 — Mouvement contre pesanteur' },
      { value: 4, label: '4 — Mouvement contre résistance partielle' },
      { value: 5, label: '5 — Force normale' },
    ]},
    { id: 'muscle_biceps', type: 'radio', label: 'Biceps (flexion coude)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'muscle_triplets', type: 'radio', label: 'Extension poignet', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'muscle_psoas', type: 'radio', label: 'Psoas (flexion hanche)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'muscle_quadriceps', type: 'radio', label: 'Quadriceps (extension genou)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'muscle_ta', type: 'radio', label: 'Tibial antérieur (flexion dorsale pied)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
  ],
  calculate: (values) => {
    const ms = [
      values.muscle_deltoide ?? 0, values.muscle_biceps ?? 0, values.muscle_triplets ?? 0,
      values.muscle_psoas ?? 0, values.muscle_quadriceps ?? 0, values.muscle_ta ?? 0,
    ]
    const total = ms.reduce((a, b) => a + b, 0)
    const avg = (total / 6).toFixed(1)
    const mrc_sum = total
    return { value: parseFloat(avg), label: `MRC sum score : ${mrc_sum}/30 (moyenne ${avg}/5)`,
      details: {
        'Deltoïde': `${ms[0]}/5`, 'Biceps': `${ms[1]}/5`, 'Extension poignet': `${ms[2]}/5`,
        'Psoas': `${ms[3]}/5`, 'Quadriceps': `${ms[4]}/5`, 'Tibial antérieur': `${ms[5]}/5`,
      },
      severity: avg < 3 ? 'high' : avg < 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 1.9, label: 'Paralysie / déficit sévère', severity: 'high' },
        { min: 2, max: 2.9, label: 'Déficit modéré à sévère', severity: 'high' },
        { min: 3, max: 3.9, label: 'Déficit léger à modéré', severity: 'moderate' },
        { min: 4, max: 4.9, label: 'Déficit léger', severity: 'low' },
        { min: 5, max: 5, label: 'Force normale', severity: 'low' },
      ],
    }
  },
  interpretation: 'Le MRC sum score (0–30) est la somme des cotations de 6 groupes musculaires (3 au membre supérieur, 3 au membre inférieur). Un score < 30 est anormal.',
  clinicalCommentary: 'L'échelle MRC est la référence pour la cotation de la force musculaire en neurologie. Le MRC sum score (6 muscles côté dominant) est validé pour le suivi des neuromusculaires et le pronostic des neuropathies de réanimation.',
  references: [{ type: 'pubmed', title: 'Medical Research Council — Aids to examination of the peripheral nervous system. 1976', pmid: '13372743' }],
}
export default mrcmuscforce"""

F["neurologie/tcmasters"] = """import type { FormulaDefinition } from '../types'

const tcmasters: FormulaDefinition = {
  id: 'tcmasters', slug: 'tcmasters',
  name: 'Classification des Traumatismes Crâniens (Masters)',
  specialty: 'neurologie', category: 'Traumatologie',
  description: 'Classification de la gravité du traumatisme crânien selon les critères de Masters — risque de lésion intracrânienne',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'perte_connaissance', type: 'radio', label: 'Perte de connaissance initiale', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'glasgow', type: 'radio', label: 'Score de Glasgow initial', options: [
      { value: 3, label: '≤ 12' },
      { value: 1, label: '13–14' },
      { value: 0, label: '15' },
    ]},
    { id: 'amnestic_ante', type: 'radio', label: 'Amnésie antérograde (> 30 min)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'vomissements', type: 'radio', label: 'Vomissements (≥ 2)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'convulsion_trauma', type: 'radio', label: 'Crise convulsive post-traumatique', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'cephalee_intense', type: 'radio', label: 'Céphalée intense et persistante', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'focal_sign', type: 'radio', label: 'Signe neurologique focal', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'age', type: 'radio', label: 'Âge > 65 ans', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'mecanisme', type: 'radio', label: 'Mécanisme violent (AVP à grande vitesse, chute > 1m)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
  ],
  calculate: (values) => {
    const gcs_score = values.glasgow ?? 0
    const signs = (values.perte_connaissance ?? 0) + (values.amnestic_ante ?? 0) + (values.vomissements ?? 0) + (values.convulsion_trauma ?? 0) + (values.cephalee_intense ?? 0) + (values.focal_sign ?? 0) + (values.age ?? 0) + (values.mecanisme ?? 0)
    let risk = 'low', grade = 'Mineur'
    if (gcs_score >= 3 || signs >= 3) { risk = 'high'; grade = 'Sévère' }
    else if (gcs_score >= 1 || signs >= 1) { risk = 'moderate'; grade = 'Modéré' }
    return { value: signs, label: `TC ${grade} — Signes associés : ${signs}`,
      severity: risk as 'high' | 'moderate' | 'low',
      ranges: [
        { min: -Infinity, max: Infinity, label: `Grade ${grade} — Adapter la prise en charge`, severity: risk as 'high' | 'moderate' | 'low' },
      ],
    }
  },
  interpretation: 'La classification de Masters stratifie le risque de lésion intracrânienne après traumatisme crânien pour guider la décision de scanner cérébral.',
  clinicalCommentary: 'Proche des critères de la SFMU/Recommandations pour la TDM après TC. Le scanner cérébral immédiat est indiqué en cas de Glasgow < 15, signe neurologique focal, ou facteur de risque majeur.',
  references: [{ type: 'pubmed', title: 'Masters SJ et al. The role of CT in head trauma. Radiology 1987', pmid: '3797458' }],
}
export default tcmasters"""

print("✅ Pédiatrie & Neurologie formulas defined")
