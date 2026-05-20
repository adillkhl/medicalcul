import type { FormulaDefinition } from '../types'

const opioides_equiv: FormulaDefinition = {
  id: 'opioides-equiv',
  slug: 'opioides_equiv',
  name: 'Opioïdes, équivalences',
  specialty: 'toxicologie',
  category: 'Opioïdes',
  description: 'Table d\'équivalences des principaux opioïdes pour la conversion de doses. Utile pour le relais entre molécules (ex: morphine → oxycodone) et l\'évaluation des doses ingérées en cas d\'intoxication.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'source_drug',
      type: 'select',
      label: 'Opioïde source (celui que l\'on souhaite convertir)',
      options: [
        { value: 'morphine_po', label: 'Morphine PO' },
        { value: 'morphine_iv', label: 'Morphine IV/SC' },
        { value: 'oxycodone_po', label: 'Oxycodone PO' },
        { value: 'oxycodone_iv', label: 'Oxycodone IV' },
        { value: 'hydromorphone_po', label: 'Hydromorphone PO' },
        { value: 'fentanyl_td', label: 'Fentanyl transdermique (patch)' },
        { value: 'fentanyl_iv', label: 'Fentanyl IV' },
        { value: 'sufentanil_iv', label: 'Sufentanil IV' },
        { value: 'codeine_po', label: 'Codéine PO' },
        { value: 'tramadol_po', label: 'Tramadol PO' },
        { value: 'tramadol_iv', label: 'Tramadol IV' },
        { value: 'methadone_po', label: 'Méthadone PO' },
      ],
    },
    {
      id: 'target_drug',
      type: 'select',
      label: 'Opioïde cible (celui que l\'on souhaite obtenir)',
      options: [
        { value: 'morphine_po', label: 'Morphine PO' },
        { value: 'morphine_iv', label: 'Morphine IV/SC' },
        { value: 'oxycodone_po', label: 'Oxycodone PO' },
        { value: 'oxycodone_iv', label: 'Oxycodone IV' },
        { value: 'hydromorphone_po', label: 'Hydromorphone PO' },
        { value: 'fentanyl_td', label: 'Fentanyl transdermique (patch)' },
        { value: 'fentanyl_iv', label: 'Fentanyl IV' },
        { value: 'sufentanil_iv', label: 'Sufentanil IV' },
        { value: 'codeine_po', label: 'Codéine PO' },
        { value: 'tramadol_po', label: 'Tramadol PO' },
        { value: 'tramadol_iv', label: 'Tramadol IV' },
        { value: 'methadone_po', label: 'Méthadone PO' },
      ],
    },
    {
      id: 'source_dose',
      type: 'number',
      label: 'Dose source (en mg)',
      min: 0.1,
      max: 5000,
      step: 0.1,
      placeholder: 'Dose quotidienne totale si relais, ou dose unitaire',
    },
  ],
  calculate: (values) => {
    const source = values.source_drug as string
    const target = values.target_drug as string
    const dose = values.source_dose as number

    // Equianalgesic ratios (relative to morphine PO = 1)
    const ratios: Record<string, number> = {
      morphine_po: 1,
      morphine_iv: 3,
      oxycodone_po: 1.5,
      oxycodone_iv: 3,
      hydromorphone_po: 7.5,
      fentanyl_td: 100, // 100 mg morphine PO = 1 mg fentanyl TD
      fentanyl_iv: 300,
      sufentanil_iv: 1000,
      codeine_po: 0.1,
      tramadol_po: 0.2,
      tramadol_iv: 0.3,
      methadone_po: 4, // highly variable; simplified
    }

    const sourceRatio = ratios[source]
    const targetRatio = ratios[target]

    if (!sourceRatio || !targetRatio) {
      return {
        value: 0,
        label: 'Erreur de conversion — molécule ou voie non reconnue',
        severity: 'low',
      }
    }

    // Convert source dose to morphine PO equivalent
    const morphineEq = dose / sourceRatio

    // Convert morphine PO equivalent to target dose
    const targetDose = morphineEq * targetRatio

    const roundedDose = Math.round(targetDose * 100) / 100

    let label = ''
    if (source === target) {
      label = 'Même molécule et voie — aucune conversion nécessaire'
    } else {
      label = `${dose} mg de ${source.replace('_', ' ')} → ${roundedDose} mg de ${target.replace('_', ' ')}`
    }

    return {
      value: roundedDose,
      label,
      severity: 'moderate',
      details: {
        'Dose source': `${dose} mg (${source.replace('_', ' ')})`,
        'Dose morphine PO équivalente': `${Math.round(morphineEq * 100) / 100} mg`,
        'Dose cible': `${roundedDose} mg (${target.replace('_', ' ')})`,
        'Ratio de conversion': `1:${Math.round((targetRatio / sourceRatio) * 100) / 100}`,
        'Facteur de prudence': 'Réduire la dose calculée de 25-50% pour la première administration (tolérance croisée incomplète)',
      },
      ranges: [
        { min: 0, max: 0, label: 'Erreur de conversion', severity: 'low' },
        { min: 0.001, max: 1e6, label: 'Dose convertie — voir détails', severity: 'moderate' },
      ],
    }
  },
  interpretation: `Les **équivalences opioïdes** permettent de convertir une dose d'un opioïde en une dose équivalente d'un autre.

⚠️ **Règles de prudence :**
- La tolérance croisée entre opioïdes est **incomplète** : réduire la dose calculée de **25 à 50 %** pour la première administration
- Les ratios sont des **estimations** ; adapter selon la réponse clinique et les effets secondaires
- La **méthadone** a une pharmacocinétique complexe (demi-vie longue, risque d'accumulation) : conversion particulièrement risquée, avis spécialisé recommandé
- En cas de **doute** : demander l'avis d'une équipe de soins palliatifs ou d'un centre de la douleur`,
  clinicalCommentary: `La conversion d'un opioïde à un autre est une situation à risque d'erreur médicamenteuse. Toujours recalculer la dose après conversion. Pour les patchs de fentanyl : 100 mg/j de morphine PO équivalent ≈ 25 µg/h de fentanyl TD. La rotation des opioïdes peut améliorer l'efficacité antalgique et réduire les effets indésirables. Attention aux interactions médicamenteuses (inhibiteurs du CYP3A4 : antifongiques azolés, macrolides — augmentent les taux d'oxycodone et de fentanyl).`,
  references: [
    {
      type: 'pubmed',
      title: 'Pereira J et al. Equianalgesic dose ratios for opioids: a systematic review. J Pain Symptom Manage 2001',
      pmid: '11316579',
    },
    {
      type: 'pubmed',
      title: 'Trescot AM et al. Opioid pharmacology. Pain Physician 2008',
      pmid: '18443635',
    },
  ],
}

export default opioides_equiv
