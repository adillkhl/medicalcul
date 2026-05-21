import type { FormulaDefinition } from '../types'

const ottawacephalee: FormulaDefinition = {
  id: 'ottawacephalee', slug: 'ottawacephalee',
  name: 'Ottawa Subarachnoid Hemorrhage Rule — Règle d\'Ottawa pour l\'Hémorragie Sous-Arachnoïdienne',
  specialty: 'urgence', category: 'Neurologie',
  description: 'Règle de décision clinique d\'Ottawa pour l\'hémorragie sous-arachnoidienne (HSA/DSA). Permet de décider de la nécessité d\'un scanner cérébral sans injection chez les patients avec céphalée aiguë non traumatique. Si un critère est présent : scanner recommandé.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 10, max: 100, step: 1, placeholder: 'Ex: 45' },
    { id: 'survenue_effort', type: 'boolean', label: 'Céphalée survenue à l\'effort (y compris pendant l\'activité sexuelle, l\'exercice, la défécation)', weight: 1 },
    { id: 'atteinte_foudroyante', type: 'boolean', label: 'Céphalée à début foudroyant (atteinte du pic en < 1 heure)', weight: 1 },
    { id: 'raideur_meningee', type: 'boolean', label: 'Raideur de nuque (signe méningé à l\'examen clinique)', weight: 1 },
    { id: 'perte_connaissance', type: 'boolean', label: 'Perte de connaissance initiale (syncope, lipothymie)', weight: 1 },
    { id: 'nevralgie_trigem', type: 'boolean', label: 'Déficit neurologique (atteinte nerf crânien, III, VI, etc.)', weight: 1 },
    { id: 'effort_valsalva', type: 'boolean', label: 'Début pendant un effort de Valsalva (toux, éternuement, port de charge)', weight: 1 },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 35
    const effort = values.survenue_effort ? 1 : 0
    const foudroyante = values.atteinte_foudroyante ? 1 : 0
    const raideur = values.raideur_meningee ? 1 : 0
    const perteConnaissance = values.perte_connaissance ? 1 : 0
    const neuro = values.nevralgie_trigem ? 1 : 0
    const valsalva = values.effort_valsalva ? 1 : 0

    const criteres = effort + foudroyante + raideur + perteConnaissance + neuro + valsalva

    // Ottawa SAH rule: scanner cérébral (non injecté) recommandé si UN critère présent
    const scannerIndique = criteres >= 1

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''
    let riskText = ''

    if (!scannerIndique) {
      label = 'Ottawa SAH Rule — Scanner non indiqué (aucun critère positif)'
      severity = 'low'
      recommendation = 'Aucun critère d\'Ottawa positif. Le scanner cérébral n\'est pas indiqué en urgence. Probabilité de HSA très faible (< 0.5%). Diagnostiquer une céphalée primaire (migraine, céphalée de tension, algies vasculaires de la face).'
      riskText = 'Négatif — HSA très improbable (< 0.5%)'
    } else {
      label = `Ottawa SAH Rule — Scanner indiqué (${criteres} critère(s) positif(s))`
      severity = 'high' // need to rule out HSA
      recommendation = 'Au moins un critère d\'Ottawa positif. Scanner cérébral sans injection en urgence (sensibilité > 99% pour HSA dans les 24h). Si scanner négatif et suspicion forte : ponction lombaire (recherche de xanthochromie).'
      riskText = `Positif — Scanner cérébral non injecté indiqué (${criteres} critère(s))`
    }

    // Determine severity based on findings
    let finalSeverity: 'low' | 'moderate' | 'high' | 'critical' = severity

    // Calculate a weighted urgency score
    const weightedScore = (foudroyante * 3) + (raideur * 3) + (neuro * 3) + (perteConnaissance * 2) + (effort * 1) + (valsalva * 1)
    if (scannerIndique && weightedScore >= 6) {
      finalSeverity = 'critical'
      recommendation += ' Présentation très suspecte : urgence vitale. PCI + transport médicalisé si nécessaire.'
    } else if (scannerIndique && weightedScore >= 3) {
      finalSeverity = 'high'
    } else if (scannerIndique) {
      finalSeverity = 'moderate'
    }

    return {
      value: scannerIndique ? 1 : 0,
      label,
      severity: finalSeverity,
      recommendation,
      details: {
        'Âge': `${age} ans`,
        'Céphalée d\'effort': effort ? 'Oui' : 'Non',
        'Début foudroyant (< 1h)': foudroyante ? 'Oui' : 'Non',
        'Raideur de nuque': raideur ? 'Oui' : 'Non',
        'Perte de connaissance': perteConnaissance ? 'Oui' : 'Non',
        'Déficit neurologique': neuro ? 'Oui' : 'Non',
        'Effort Valsalva': valsalva ? 'Oui' : 'Non',
        'Critères positifs': `${criteres}/6`,
        'Scanner indiqué': scannerIndique ? 'OUI — Scanner cérébral sans injection' : 'Non',
        'Risque HSA': riskText,
      },
      ranges: [
        { min: 0, max: 0, label: 'Scanner non indiqué', severity: 'low', recommendation: 'Céphalée primaire probable.' },
        { min: 1, max: 6, label: 'Scanner indiqué', severity: 'high', recommendation: 'Scanner cérébral en urgence.' },
      ],
    }
  },
  interpretation: `**Ottawa SAH Rule — Règle d\'Ottawa pour l\'Hémorragie Sous-Arachnoïdienne**

Règle de décision clinique validée pour déterminer la nécessité d\'un scanner cérébral sans injection chez les patients consultant pour une céphalée aiguë non traumatique.

**Critères (si UN est présent → scanner) :**
1. **Âge ≥ 40 ans**
2. **Céphalée à l\'effort** (y compris activité sexuelle, défécation)
3. **Début foudroyant** (atteinte du pic en < 1 heure)
4. **Raideur de nuque** (signe méningé)
5. **Perte de connaissance initiale** (syncope)
6. **Déficit neurologique** (atteinte d\'une paire crânienne)
7. **Début pendant un effort de Valsalva** (toux, éternuement)

**Performance :** Sensibilité 100% (IC 97-100%), Spécificité 14% pour le diagnostic de HSA.

**Attention :** La règle s\'applique aux patients avec céphalée aiguë non traumatique (< 28 jours), sans antécédent d\'anévrisme connu.`,
  clinicalCommentary: 'L\'Ottawa SAH Rule est la règle de décision clinique la plus validée pour le diagnostic d\'hémorragie sous-arachnoïdienne. Sensibilité de 100% dans les études de validation (aucune HSA manquée). Cependant, la spécificité est faible (beaucoup de faux positifs). Un scanner négatif dans les 6 heures suivant le début des symptômes a une sensibilité de 100% (sensibilité diminue après 24h). Si le scanner est négatif et la suspicion clinique persistante, une ponction lombaire avec recherche de xanthochromie (spectrophotométrie) est indiquée.',
  references: [
    { type: 'pubmed', title: 'Perry JJ et al. Clinical decision rules to rule out subarachnoid hemorrhage for acute headache. JAMA 2013', pmid: '23904169' },
    { type: 'pubmed', title: 'Perry JJ et al. Sensitivity of computed tomography performed within six hours of onset of headache for diagnosis of subarachnoid haemorrhage. BMJ 2011', pmid: '21349898' },
    { type: 'guideline', title: 'HAS — Prise en charge des céphalées aux urgences', url: 'https://www.has-sante.fr/' },
  ],
}
export default ottawacephalee
