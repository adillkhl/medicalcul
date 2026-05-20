import type { FormulaDefinition } from '../types'

const hints: FormulaDefinition = {
  id: 'hints',
  slug: 'hints',
  name: 'HINTS — Vertige vestibulaire vs central',
  specialty: 'orl',
  category: 'Vertige',
  description: 'HINTS (Head Impulse, Nystagmus, Test of Skew) — différenciation vertige central vs périphérique aux urgences',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'headImpulse',
      type: 'radio',
      label: 'Head Impulse Test (HIT) — Impulsion céphalique',
      options: [
        { value: 1, label: 'Normal (saccade de correction ABSENTE) → suspect central' },
        { value: -1, label: 'Anormal (saccade de correction PRÉSENTE) → périphérique' },
      ],
    },
    {
      id: 'nystagmus',
      type: 'radio',
      label: 'Nystagmus',
      options: [
        { value: 1, label: 'Vertical / bidirectionnel / changeant → suspect central' },
        { value: -1, label: 'Horizontal unidirectionnel (périphérique)' },
      ],
    },
    {
      id: 'skew',
      type: 'radio',
      label: 'Test of Skew (déviation verticale alternative)',
      options: [
        { value: 1, label: 'Présent (déviation verticale corrigée) → suspect central' },
        { value: -1, label: 'Absent → périphérique' },
      ],
    },
  ],
  calculate: (values) => {
    const hi = values.headImpulse
    const ny = values.nystagmus
    const sk = values.skew

    const centralSigns = (hi === 1 ? 1 : 0) + (ny === 1 ? 1 : 0) + (sk === 1 ? 1 : 0)
    const peripheralSigns = (hi === -1 ? 1 : 0) + (ny === -1 ? 1 : 0) + (sk === -1 ? 1 : 0)

    const isCentral = centralSigns > 0
    const allPeripheral = peripheralSigns === 3

    if (isCentral && !allPeripheral) {
      return {
        value: 1,
        label: 'HINTS POSITIF — Suspect CENTRAL',
        risk: centralSigns > 1 ? 98 : 85,
        riskUnit: '% spécificité',
        severity: 'critical',
        ranges: [
          { min: 0, max: 0, label: 'HINTS NÉGATIF — Périphérique (neurite vestibulaire)', severity: 'low', recommendation: 'Pas d\'imagerie urgente. Traitement symptomatique : corticothérapie si neurite, antivertigineux (Tanganil, Serc), rééducation vestibulaire.' },
          { min: 1, max: 1, label: 'HINTS POSITIF — Suspect syndrome vestibulaire CENTRAL', severity: 'critical', recommendation: 'IRM cérébrale + angio-IRM en urgence. Avis neurologique. Recherche accident ischémique du tronc cérébral / cervelet (AIC).' },
          { min: 2, max: 3, label: 'HINTS FORTEMENT POSITIF — Central probable', severity: 'critical', recommendation: 'IRM cérébrale + angio-IRM en URGENCE. Avis neurologique immédiat. Probabilité d\'AVC postérieur > 95%.' },
        ],
      }
    }

    if (allPeripheral) {
      return {
        value: 0,
        label: 'HINTS NÉGATIF — Périphérique (neurite vestibulaire)',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'HINTS NÉGATIF — Périphérique', severity: 'low', recommendation: 'Aucune imagerie urgente. Diagnostic différentiel : neurite vestibulaire vs labyrinthite. Corticoïdes si neurite début < 72h. Antivertigineux (Acétylleucine, bétahistine). Rééducation vestibulaire.' },
        ],
      }
    }

    return {
      value: centralSigns,
      label: 'HINTS POSITIF — Suspect CENTRAL',
      severity: 'high',
      ranges: [
        { min: 0, max: 0, label: 'Périphérique (tous les signes périphériques)', severity: 'low' },
        { min: 1, max: 3, label: 'Central (≥ 1 signe central)', severity: 'critical', recommendation: 'IRM + angio-IRM urgente. Avis neuro.' },
      ],
    }
  },
  interpretation: `Le **HINTS** est le test clinique le plus fiable pour différencier une cause centrale (urgente) d’une cause périphérique (bénigne) de vertige aigu, aux urgences.

**Les 3 signes HINTS :**
1. **Head Impulse Test** : normal = central (pas de correction), anormal = périphérique
2. **Nystagmus** : vertical/bidirectionnel = central, horizontal unidirectionnel = périphérique
3. **Test of Skew** : déviation verticale alternative = central, absent = périphérique

Un seul signe central suffit à suspecter un AVC du tronc cérébral ou du cervelet. Le HINTS est plus sensible que l’IRM dans les premières 48h d'un AVC postérieur (100% vs 88%).`,
  clinicalCommentary: `Le HINTS est PLUS PERFORMANT que l'IRM précoce pour l’AVC postérieur dans les 48h. HINTS négatif = neurite vestibulaire jusqu'à preuve du contraire. Attention : ne s’applique PAS aux vertiges paroxystiques positionnels (VPPB). Le HINTS se fait AUX URGENCES, pas au cabinet pour un patient stable. Faites un HINTS à tout vertige aigu + nystagmus + nausées/vomissements. Si le patient a des facteurs de risque vasculaire (HTA, diabète, âge > 60, tabac) et un HINTS positif : IRM en urgence.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kattah JC et al. HINTS to diagnose stroke in the acute vestibular syndrome. Stroke 2009',
      pmid: '19762709',
    },
    {
      type: 'pubmed',
      title: 'Newman-Toker DE et al. HINTS outperforms ABCD2 to rule out stroke in acute vertigo. Acad Emerg Med 2013',
      pmid: '24033619',
    },
    {
      type: 'guideline',
      title: 'SFORL — Conduite à tenir devant un vertige (2022)',
      url: 'https://www.sforl.org',
    },
  ],
}

export default hints
