import type { FormulaDefinition } from '../types'

const cornell: FormulaDefinition = {
  id: 'cornell', slug: 'cornell',
  name: 'Cornell Voltage Criteria (Critères Électriques d\'Hypertrophie VG)',
  specialty: 'cardiologie', category: 'ECG',
  description: 'Critères de Cornell pour le diagnostic électrique d\'hypertrophie ventriculaire gauche (HVG) sur l\'ECG de repos — critères de voltage et produit durée-voltage',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'raVL', type: 'number', label: 'Onde R en aVL', unit: 'mm', min: 0, max: 40, step: 1, placeholder: 'Ex: 12' },
    { id: 'sv3', type: 'number', label: 'Onde S en V3', unit: 'mm', min: 0, max: 50, step: 1, placeholder: 'Ex: 18' },
    { id: 'duree_qrs', type: 'number', label: 'Durée QRS', unit: 'ms', min: 60, max: 200, step: 1, placeholder: 'Ex: 100' },
    { id: 'sex', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
  ],
  calculate: (values) => {
    const raVL = Number(values.raVL) || 0
    const sv3 = Number(values.sv3) || 0
    const dureeQRS = Number(values.duree_qrs) || 100
    const male = values.sex === 1

    // Critère de voltage de Cornell (standard) : S en V3 + R en aVL > 28 mm (homme) ou > 20 mm (femme)
    const voltageCornell = sv3 + raVL
    const seuilVoltage = male ? 28 : 20
    const voltagePositif = voltageCornell > seuilVoltage

    // Cornell product : (S V3 + R aVL) * durée QRS > 2440 mm·ms
    const cornellProduct = voltageCornell * dureeQRS
    const seuilProduct = 2440
    const productPositif = cornellProduct > seuilProduct

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''

    if (voltagePositif && productPositif) {
      severity = 'high'
      label = `HVG probable — Cornell voltage ${voltageCornell}mm (>${seuilVoltage}) ET produit ${cornellProduct} mm·ms (>${seuilProduct})`
    } else if (voltagePositif || productPositif) {
      severity = 'moderate'
      label = `HVG possible — Un critère positif (voltage=${voltageCornell}mm, produit=${cornellProduct} mm·ms)`
    } else {
      severity = 'low'
      label = `Pas d\'HVG — Cornell voltage ${voltageCornell}mm, produit ${cornellProduct} mm·ms`
    }

    return {
      value: voltageCornell,
      label,
      severity,
      details: {
        'R aVL': `${raVL} mm`,
        'S V3': `${sv3} mm`,
        'Somme (SV3 + RaVL)': `${voltageCornell} mm`,
        'Seuil voltage': `${seuilVoltage} mm (${male ? 'H' : 'F'})`,
        'Voltage HVG': voltagePositif ? 'Oui' : 'Non',
        'Durée QRS': `${dureeQRS} ms`,
        'Produit Cornell': `${cornellProduct} mm·ms`,
        'Produit HVG': productPositif ? 'Oui' : 'Non',
        'Conclusion': severity === 'low' ? 'Normal' : severity === 'moderate' ? 'Suspect' : 'HVG probable',
      },
      ranges: [
        { min: 0, max: seuilVoltage, label: `Voltage ≤ ${seuilVoltage}mm : Normal`, severity: 'low' },
        { min: seuilVoltage + 1, max: 100, label: `Voltage > ${seuilVoltage}mm : HVG possible`, severity: 'moderate' },
      ],
    }
  },
  interpretation: 'Les **critères de Cornell** sont des critères électrocardiographiques validés pour le diagnostic d\'hypertrophie ventriculaire gauche (HVG).\n\n**1. Critère de voltage de Cornell :** SV3 + RaVL > 28 mm (homme) ou > 20 mm (femme)\n**2. Produit durée-voltage de Cornell :** (SV3 + RaVL) × durée QRS > 2440 mm·ms\n\nLa spécificité du critère combiné (voltage + produit) est élevée (> 90%). La sensibilité est modérée (~40-50%).',
  clinicalCommentary: 'Les critères de Cornell sont plus spécifiques que le critère de Sokolow-Lyon (SV1 + RV5/6 > 35 mm) pour le diagnostic d\'HVG. Ils sont notamment recommandés par l\'ESC pour l\'évaluation de l\'HVG chez l\'hypertendu. L\'HVG électrique doit toujours être confirmée par échocardiographie ou IRM cardiaque. Le Cornell product a l\'avantage d\'intégrer la durée QRS, reflétant à la fois l\'augmentation de voltage et l\'élargissement QRS liés à l\'HVG.',
  references: [
    { type: 'pubmed', title: 'Casale PN et al. Improved ECG detection of LVH using the Cornell product. J Am Coll Cardiol 1987', pmid: '2959722' },
    { type: 'pubmed', title: 'Okin PM et al. Performance of the ECG Cornell product in detecting LVH. J Electrocardiol 1997', pmid: '9147309' },
  ],
}
export default cornell
