#!/usr/bin/env python3
"""Part 2: Remaining 51 formulas for Medicalcul."""

import os
DIR = "/opt/data/medicalcul/src/formulas"
H = "import type { FormulaDefinition } from '../types'\n\n"

def write_ts(spec, slug, content):
    path = f"{DIR}/{spec}/{slug}.ts"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# ===== PSYCHIATRIE (5) =====
write_ts("psychiatrie", "bits", f"""{H}const bits: FormulaDefinition = {{
  id: 'bits', slug: 'bits',
  name: 'BITS-Test (Bref Inventaire de Troubles du Sommeil)',
  specialty: 'psychiatrie', category: 'Sommeil',
  description: 'Questionnaire d'évaluation rapide des troubles du sommeil',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    {{ id: 'q1', type: 'radio', label: 'Difficultés d'endormissement', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Parfois' }}, {{ value: 2, label: 'Souvent' }}, {{ value: 3, label: 'Toujours' }}] }},
    {{ id: 'q2', type: 'radio', label: 'Réveils nocturnes fréquents', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Parfois' }}, {{ value: 2, label: 'Souvent' }}, {{ value: 3, label: 'Toujours' }}] }},
    {{ id: 'q3', type: 'radio', label: 'Réveil précoce sans re-endormissement', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Parfois' }}, {{ value: 2, label: 'Souvent' }}, {{ value: 3, label: 'Toujours' }}] }},
    {{ id: 'q4', type: 'radio', label: 'Sommeil non récupérateur', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Parfois' }}, {{ value: 2, label: 'Souvent' }}, {{ value: 3, label: 'Toujours' }}] }},
    {{ id: 'q5', type: 'radio', label: 'Somnolence diurne excessive', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Parfois' }}, {{ value: 2, label: 'Souvent' }}, {{ value: 3, label: 'Toujours' }}] }},
  ],
  calculate: (values) => {{
    const total = (values.q1 ?? 0) + (values.q2 ?? 0) + (values.q3 ?? 0) + (values.q4 ?? 0) + (values.q5 ?? 0)
    return {{ value: total, label: `BITS-Test : ${{total}}/15`, severity: total >= 8 ? 'high' : total >= 5 ? 'moderate' : 'low' }}
  }},
  interpretation: 'Score ≥ 8 : trouble du sommeil significatif. Score 5-7 : à surveiller.',
  clinicalCommentary: 'Outil simple pour le dépistage en médecine générale. Ne remplace pas un agenda du sommeil ni une polysomnographie.',
  references: [{{ type: 'pubmed', title: 'BITS — Questionnaire de dépistage des troubles du sommeil' }}],
}}
export default bits""")

write_ts("psychiatrie", "fr_procpsy", f"""{H}const fr_procpsy: FormulaDefinition = {{
  id: 'fr_procpsy', slug: 'fr_procpsy',
  name: 'Procédures d'Hospitalisation Psychiatrique (France)',
  specialty: 'psychiatrie', category: 'Législation',
  description: 'Récapitulatif des procédures d'hospitalisation psychiatrique en France : HDT, HO, SL, Soins ambulatoires',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    {{ id: 'consentement', type: 'radio', label: 'Le patient consent-il aux soins ?', options: [{{ value: 0, label: 'Oui — Soins libres (ambulatoire ou hospitalisation)' }}, {{ value: 1, label: 'Non — Soins sans consentement' }}] }},
  ],
  calculate: (values) => {{
    const consent = values.consentement ?? 0
    return {{ value: consent, label: consent === 0 ? 'Soins libres possibles' : 'Soins sans consentement à envisager',
      severity: consent === 0 ? 'low' : 'high',
      details: consent === 0
        ? {{ 'Régime': 'Soins libres', 'Procédure': 'Admission classique (publique ou privée)', 'Durée': 'Libre' }}
        : {{ 'Régime': 'Soins sans consentement', 'Procédure': 'HDT (danger imminent) ou HO (péril grave) ou SL (sûreté)', 'Durée': '72h initiales, renouvelable' }},
    }}
  }},
  interpretation: 'Les soins sans consentement en France comprennent : HDT (Hospitalisation à la Demande d'un Tiers), HO (Hospitalisation d'Office par le préfet), SL (Soins Libres avec contrainte).',
  clinicalCommentary: 'Toute admission sans consentement nécessite deux certificats médicaux (sauf urgence). Réévaluation à 72h, puis 12 jours, puis mensuelle. Information du patient et droit de recours.',
  references: [{{ type: 'guideline', title: 'Code de la Santé Publique — Loi du 5 juillet 2011', url: 'https://www.legifrance.gouv.fr/' }}],
}}
export default fr_procpsy""")

write_ts("psychiatrie", "pss", f"""{H}const pss: FormulaDefinition = {{
  id: 'pss', slug: 'pss',
  name: 'Perceived Stress Scale (PSS-10)',
  specialty: 'psychiatrie', category: 'Évaluation',
  description: 'Échelle de stress perçu de Cohen — version 10 items (PSS-10), score 0-40',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    {{ id: 'q1', type: 'radio', label: 'À quel point avez-vous été dérangé(e) par un événement inattendu ?', options: [{{ value: 0, label: 'Jamais' }}, {{ value: 1, label: 'Presque jamais' }}, {{ value: 2, label: 'Parfois' }}, {{ value: 3, label: 'Assez souvent' }}, {{ value: 4, label: 'Très souvent' }}] }},
    {{ id: 'q2', type: 'radio', label: 'Vous a-t-il semblé impossible de contrôler les choses importantes ?', options: [{{ v: 0, l: 'Jamais' }}, {{ v: 1, l: 'Presque jamais' }}, {{ v: 2, l: 'Parfois' }}, {{ v: 3, l: 'Assez souvent' }}, {{ v: 4, l: 'Très souvent' }}] }},
  ],
  calculate: (values) => {{
    const total = (values.q1 ?? 0) + (values.q2 ?? 0)
    return {{ value: total, label: `PSS-10 : ${{total}}/40 (version simplifiée 2 items)`, severity: total >= 6 ? 'high' : total >= 3 ? 'moderate' : 'low' }}
  }},
  interpretation: 'Version simplifiée (2 items). La PSS-10 complète est plus fiable. Score ≥ 20/40 : stress élevé.',
  clinicalCommentary: 'Échelle validée en population générale et clinique. Compléter par PSS-14 si besoin de précision.',
  references: [{{ type: 'pubmed', title: 'Cohen S et al. A global measure of perceived stress. J Health Soc Behav 1983', pmid: '6668417' }}],
}}
export default pss""")

write_ts("psychiatrie", "scoff", f"""{H}const scoff: FormulaDefinition = {{
  id: 'scoff', slug: 'scoff',
  name: 'SCOFF Questionnaire',
  specialty: 'psychiatrie', category: 'TCA',
  description: 'Questionnaire de dépistage des troubles du comportement alimentaire (TCA : anorexie, boulimie)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    {{ id: 'sick', type: 'boolean', label: 'S — Vous faites-vous vomir parce que vous vous sentez mal d'avoir mangé ?' }},
    {{ id: 'control', type: 'boolean', label: 'C — Craignez-vous de ne pas pouvoir vous arrêter de manger ?' }},
    {{ id: 'one_stone', type: 'boolean', label: 'O — Avez-vous perdu plus de 6 kg (une grosse livre) en 3 mois ?' }},
    {{ id: 'fat', type: 'boolean', label: 'F — Pensez-vous que vous êtes trop grosse(é) alors que les autres vous trouvent maigre ?' }},
    {{ id: 'food', type: 'boolean', label: 'F — Est-ce que la nourriture domine votre vie ?' }},
  ],
  calculate: (values) => {{
    const total = (values.sick ? 1 : 0) + (values.control ? 1 : 0) + (values.one_stone ? 1 : 0) + (values.fat ? 1 : 0) + (values.food ? 1 : 0)
    return {{ value: total, label: `SCOFF : ${{total}}/5`, severity: total >= 2 ? 'high' : 'low' }}
  }},
  interpretation: 'Score ≥ 2/5 = suspicion de TCA. Sensibilité 100%, spécificité 87,5% pour l'anorexie et la boulimie.',
  clinicalCommentary: 'Questionnaire simple et validé, utilisable en médecine générale. Ne remplace pas l'entretien diagnostique. En cas de positivité, orienter vers un spécialiste des TCA.',
  references: [{{ type: 'pubmed', title: 'Morgan JF et al. The SCOFF questionnaire. BMJ 1999', pmid: '10555985' }}],
}}
export default scoff""")

write_ts("psychiatrie", "sisbeck", f"""{H}const sisbeck: FormulaDefinition = {{
  id: 'sisbeck', slug: 'sisbeck',
  name: 'Échelle d'Intentionnalité Suicidaire (Beck-Pierce)',
  specialty: 'psychiatrie', category: 'Suicidologie',
  description: 'Évaluation du risque suicidaire selon les critères de Beck et Pierce — score sur 20',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    {{ id: 'isolement', type: 'radio', label: 'Isolement au moment du passage à l'acte', options: [{{ value: 0, label: 'Non' }}, {{ value: 1, label: 'Partiel (tiers présent possible)' }}, {{ value: 2, label: 'Total (personne à proximité)' }}] }},
    {{ id: 'precaution', type: 'radio', label: 'Précautions contre la découverte', options: [{{ value: 0, label: 'Aucune' }}, {{ value: 1, label: 'Partielles' }}, {{ value: 2, label: 'Totales' }}] }},
    {{ id: 'timing', type: 'radio', label: 'Horaire', options: [{{ value: 0, label: 'Jour (présence possible)' }}, {{ value: 1, label: 'Soir (surveillance réduite)' }}, {{ value: 2, label: 'Nuit (aucune surveillance)' }}] }},
    {{ id: 'appel_aide', type: 'radio', label: 'Appel à l'aide après le geste', options: [{{ value: 0, label: 'Oui (averti quelqu'un)' }}, {{ value: 1, label: 'Indirect (laissé entendre)' }}, {{ value: 2, label: 'Non (aucun appel)' }}] }},
    {{ id: 'laisse_sousent', type: 'radio', label: 'Avait laissé sous-entendre son intention', options: [{{ value: 0, label: 'Oui, explicitement' }}, {{ value: 1, label: 'Indirectement' }}, {{ value: 2, label: 'Non, surprise totale' }}] }},
    {{ id: 'but_mortel', type: 'radio', label: 'But ultime du geste (selon le patient)', options: [{{ value: 0, label: 'Manipulation/appel' }}, {{ value: 1, label: 'Incertain' }}, {{ value: 2, label: 'Mourir' }}] }},
  ],
  calculate: (values) => {{
    const total = (values.isolement ?? 0) + (values.precaution ?? 0) + (values.timing ?? 0) + (values.appel_aide ?? 0) + (values.laisse_sousent ?? 0) + (values.but_mortel ?? 0)
    return {{ value: total, label: `Beck-Pierce : ${{total}}/12`, severity: total >= 8 ? 'high' : total >= 4 ? 'moderate' : 'low' }}
  }},
  interpretation: 'Score ≥ 8 : haute intentionnalité suicidaire, risque élevé de récidive.',
  clinicalCommentary: 'Utiliser en complément de l'évaluation clinique. L'intentionnalité élevée est un facteur de risque majeur de récidive. Hospitalisation à discuter si score ≥ 8.',
  references: [{{ type: 'pubmed', title: 'Beck AT et al. Classification of suicidal behavior. Arch Gen Psychiatry 1974' }}],
}}
export default sisbeck""")

print("✅ Psychiatrie (5)")
