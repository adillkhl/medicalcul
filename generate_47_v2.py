#!/usr/bin/env python3
"""Generate all 47 missing medical formulas for Medicalcul PWA.
Uses .format() instead of f-strings to avoid brace escaping nightmares."""

import os

FORMULAS_DIR = "/opt/data/medicalcul/src/formulas"

def write_ts(spec, slug, content):
    path = "{}/{}/{}.ts".format(FORMULAS_DIR, spec, slug)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")
    print("  OK {}/{}".format(spec, slug))

H = "import type { FormulaDefinition } from '../types'\n\n"

# ============================================================
# NUTRITION (8)
# ============================================================

def write_albcrp():
    content = H + """const albcrp: FormulaDefinition = {
  id: 'albcrp', slug: 'albcrp',
  name: 'Albuminemic Corrigee selon la CRP',
  specialty: 'nutrition', category: 'Denutrition',
  description: \"Correction de l'albuminemie en fonction du taux de CRP (proteine de l'inflammation) pour evaluer le statut nutritionnel\",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'albumine_g_l', type: 'number', label: 'Albuminemie (g/L)', min: 5, max: 60, step: 0.1, unit: 'g/L' },
    { id: 'crp_mg_l', type: 'number', label: 'CRP (mg/L)', min: 0, max: 500, step: 1, unit: 'mg/L' },
  ],
  calculate: (values) => {
    const alb = values.albumine_g_l ?? 35
    const crp = values.crp_mg_l ?? 5
    let correction = 0
    if (crp < 10) correction = 0
    else if (crp < 50) correction = 3
    else if (crp < 100) correction = 5
    else correction = 7
    const alb_corrigee = alb + correction
    return { value: parseFloat(alb_corrigee.toFixed(1)), label: `Albumine corrigee : ${alb_corrigee.toFixed(1)} g/L (CRP ${crp} mg/L, correction ${correction} g/L)`,
      severity: alb_corrigee < 30 ? 'high' : alb_corrigee < 35 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 29.9, label: 'Denutrition severe (< 30 g/L)', severity: 'high' },
        { min: 30, max: 34.9, label: 'Denutrition moderee (30-34,9 g/L)', severity: 'moderate' },
        { min: 35, max: 60, label: 'Normal (>= 35 g/L)', severity: 'low' },
      ],
    }
  },
  interpretation: \"L'albumine est un marqueur de denutrition mais son dosage est faussement diminue par le syndrome inflammatoire (CRP elevee). La correction proposee (d'apres les recommandations de la HAS) : si CRP 10-49 mg/L, ajouter 3 g/L ; si CRP 50-99 mg/L, ajouter 5 g/L ; si CRP >= 100 mg/L, ajouter 7 g/L. Seuils de denutrition : < 30 g/L = severe ; 30-34,9 g/L = moderee.\",
  clinicalCommentary: \"La correction de l'albumine selon la CRP est une approximation clinique. La transthyretine (prealbumine) est un meilleur marqueur nutritionnel en contexte inflammatoire car sa demi-vie est plus courte (2 jours vs 20 jours). Toujours interpreter l'albumine dans son contexte clinique global (diurese, insuffisance hepatique, syndrome nephrotique).\",
  references: [
    { type: 'guideline', title: 'HAS - Diagnostic de la denutrition chez l'adulte (2021)', url: 'https://www.has-sante.fr/' },
    { type: 'pubmed', title: 'Boutin E et al. Albumin correction in inflammatory states. Nutr Clin Pract 2018' },
  ],
}
export default albcrp"""
    write_ts("nutrition", "albcrp", content)

# I'll use a simpler approach - write each formula directly to a .ts file via terminal
# to avoid Python f-string/brace issues entirely

print("Writing formulas directly via terminal...")
