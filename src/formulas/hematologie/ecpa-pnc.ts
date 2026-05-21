import type { FormulaDefinition } from '../types'

const ecpa_pnc: FormulaDefinition = {
  id: 'ecpa-pnc', slug: 'ecpa-pnc',
  name: 'ECPA / PNC — Taille du Clone HPN (Hemoglobinurie Paroxystique Nocturne)',
  specialty: 'hematologie', category: 'HPN',
  description: 'Évaluation de la taille du clone HPN (hémoglobinurie paroxystique nocturne) par cytométrie en flux — classification ECPA/PNC (Erythrocytes/Polynucléaires neutrophiles)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'clone_erythrocytes', type: 'number', label: 'Taille du clone érythrocytaire (CD55-/CD59-)', unit: '%', min: 0, max: 100, step: 0.1, placeholder: 'Ex: 15.2' },
    { id: 'clone_granuleux', type: 'number', label: 'Taille du clone granuleux (PNC CD55-/CD59-)', unit: '%', min: 0, max: 100, step: 0.1, placeholder: 'Ex: 30.5' },
    { id: 'clone_monocytes', type: 'number', label: 'Taille du clone monocytaire (optionnel)', unit: '%', min: 0, max: 100, step: 0.1, placeholder: 'Ex: 25.0' },
    { id: 'ldh', type: 'number', label: 'LDH', unit: 'UI/L', min: 100, max: 5000, step: 1, placeholder: 'Ex: 450' },
    { id: 'signes_cliniques', type: 'radio', label: 'Signes cliniques', options: [
      { value: 0, label: 'Asymptomatique (découverte fortuite)' },
      { value: 1, label: 'Hémoglobinurie intermittente' },
      { value: 2, label: 'Hémoglobinurie persistante / anémie hémolytique' },
      { value: 3, label: 'Thrombose veineuse (sites atypiques)' },
    ]},
    { id: 'anemie', type: 'boolean', label: 'Anémie (Hb < 10 g/dL ou transfusion dépendance)' },
    { id: 'thrombose', type: 'boolean', label: 'Antécédent de thrombose veineuse' },
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale (DFG < 60 mL/min)' },
  ],
  calculate: (values) => {
    const cloneEry = Number(values.clone_erythrocytes) || 0
    const cloneGran = Number(values.clone_granuleux) || 0
    const cloneMono = Number(values.clone_monocytes) || 0
    const ldh = Number(values.ldh) || 250
    const clinique = Number(values.signes_cliniques) || 0
    const anemie = !!values.anemie
    const thrombose = !!values.thrombose
    const insufRenale = !!values.insuf_renale

    const cloneMax = Math.max(cloneEry, cloneGran, cloneMono)

    let classification: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommandation: string

    // Classification ECPA/PNC simplifiée
    if (cloneMax < 1) {
      classification = 'Clone HPN non détectable (< 1%)'
      severity = 'low'
      recommandation = 'Absence de clone HPN significatif. Diagnostic d\'HPN peu probable.'
    } else if (cloneMax < 10) {
      classification = 'Clone HPN de petite taille (1-10%)'
      severity = 'low'
      recommandation = 'Clone de petite taille. Surveillance clinique. Évolution possible vers un clone plus large.'
    } else if (cloneMax < 50) {
      classification = 'Clone HPN de taille intermédiaire (10-50%)'
      severity = 'moderate'
      recommandation = 'Clone modéré. Surveillance biologique régulière. Discuter éculizumab si hémolyse clinique significative.'
    } else {
      classification = 'Clone HPN de grande taille (> 50%)'
      severity = thrombose || anemie || clinique >= 2 ? 'high' : 'moderate'
      recommandation = 'Clone large. Risque thrombotique élevé. Discuter traitement par inhibiteur du complément (éculizumab, ravulizumab).'
    }

    // Score de sévérité clinique
    let scoreClinique = 0
    if (anemie) scoreClinique += 2
    if (thrombose) scoreClinique += 3
    if (insufRenale) scoreClinique += 2
    if (clinique >= 2) scoreClinique += 2
    else if (clinique >= 1) scoreClinique += 1
    if (ldh > 1.5 * 250) scoreClinique += 1

    if (scoreClinique >= 5) severity = 'critical'
    else if (scoreClinique >= 3) severity = severity === 'low' ? 'moderate' : severity

    return {
      value: Math.round(cloneMax * 10) / 10,
      label: `Clone HPN ${cloneMax.toFixed(1)}% — ${classification}`,
      severity,
      details: {
        'Clone érythrocytaire': `${cloneEry.toFixed(1)}%`,
        'Clone granuleux (PNC)': `${cloneGran.toFixed(1)}%`,
        'Clone monocytaire': `${cloneMono.toFixed(1)}%`,
        'Clone maximum': `${cloneMax.toFixed(1)}%`,
        'LDH': `${ldh} UI/L`,
        'Signes cliniques': ['Asymptomatique', 'Hb intermittente', 'Hb persistante', 'Thrombose'][clinique],
        'Anémie': anemie ? 'Oui' : 'Non',
        'Thrombose': thrombose ? 'Oui' : 'Non',
        'IRC': insufRenale ? 'Oui' : 'Non',
        'Classification': classification,
        'Score clinique': scoreClinique,
      },
      ranges: [
        { min: 0, max: 0.99, label: 'Clone < 1% : Non détectable', severity: 'low' },
        { min: 1, max: 9.9, label: 'Clone 1-10% : Petite taille', severity: 'low' },
        { min: 10, max: 49.9, label: 'Clone 10-50% : Taille intermédiaire', severity: 'moderate' },
        { min: 50, max: 100, label: 'Clone > 50% : Grande taille', severity: 'high' },
      ],
    }
  },
  interpretation: 'L\'**ECPA/PNC** évalue la taille du clone HPN (hémoglobinurie paroxystique nocturne) par cytométrie en flux.\n\n- **Clone érythrocytaire** (CD55-/CD59- sur globules rouges)\n- **Clone granuleux** (CD55-/CD59- sur polynucléaires neutrophiles)\n- **Clone monocytaire** (CD14-/CD48- ou CD55-/CD59- sur monocytes)\n\n**Classification :** < 1% non détectable, 1-10% petit clone, 10-50% modéré, > 50% large clone.\n\nLe risque thrombotique et la sévérité clinique sont corrélés à la taille du clone, particulièrement le clone granuleux > 50%.',
  clinicalCommentary: 'La cytométrie en flux de haute sensibilité est la méthode de référence pour le diagnostic et le suivi de l\'HPN. Le clone granuleux (PNC) est le plus fiable pour évaluer la taille réelle du clone. Un clone > 50% associé à des signes cliniques (hémolyse, thrombose) justifie un traitement par inhibiteur du complément (éculizumab, ravulizumab). Les thromboses veineuses des sites atypiques (syndrome de Budd-Chiari, thrombose porte, méningée) sont caractéristiques.',
  references: [
    { type: 'pubmed', title: 'Brodsky RA. Paroxysmal nocturnal hemoglobinuria. Blood 2014', pmid: '24894770' },
    { type: 'pubmed', title: 'Hillmen P et al. Effect of eculizumab on hemolysis and transfusion requirements in PNH. NEJM 2004', pmid: '15070701' },
  ],
}
export default ecpa_pnc
