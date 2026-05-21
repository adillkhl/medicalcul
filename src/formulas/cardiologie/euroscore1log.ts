import type { FormulaDefinition } from '../types'

const euroscore2: FormulaDefinition = {
  id: 'euroscore2',
  slug: 'euroscore1log',
  name: 'EuroSCORE II (Risque de mortalite en chirurgie cardiaque)',
  specialty: 'cardiologie',
  category: 'Chirurgie cardiaque',
  description: 'EuroSCORE II — risque de mortalite operatoire en chirurgie cardiaque (modele 2012)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Age du patient', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'sexe_feminin', type: 'boolean', label: 'Sexe feminin' },
    // Créatininémie (pour calcul du débit de filtration)
    { id: 'creatinine', type: 'number', label: 'Creatininemie pre-operatoire', unit: 'umol/L', min: 20, max: 1000, step: 1, placeholder: 'Ex: 100' },
    // ClCr estimée à partir de la créatinine (Cockcroft)
    { id: 'clcr', type: 'number', label: 'Clairance de la creatinine (Cockcroft)', unit: 'mL/min', min: 5, max: 200, step: 1, placeholder: 'Ex: 85' },
    // FEVG
    { id: 'FEVG', type: 'radio', label: 'Fraction d ejection ventriculaire gauche',
      options: [
        { value: 0, label: 'FEVG > 50 % (normale)' },
        { value: 1, label: 'FEVG 31-50 % (moderement alteree)' },
        { value: 2, label: 'FEVG 21-30 % (severement alteree)' },
        { value: 3, label: 'FEVG < 21 % (tres severement alteree)' },
      ] },
    // NYHA
    { id: 'nyha', type: 'radio', label: 'Classe NYHA',
      options: [
        { value: 0, label: 'I — Pas de limitation' },
        { value: 1, label: 'II — Limitation legere' },
        { value: 2, label: 'III — Limitation moderee' },
        { value: 3, label: 'IV — Limitation severe (symptomes au repos)' },
      ] },
    // CCS 4
    { id: 'ccs4', type: 'boolean', label: 'Angor instable CCS classe 4 (angor au repos)' },
    // Diabète insulino-requérant
    { id: 'diabete_insuline', type: 'boolean', label: 'Diabete insulino-requerant' },
    // HTA pulmonaire
    { id: 'hta_pulm', type: 'boolean', label: 'Hypertension pulmonaire (PAPs > 55 mmHg)' },
    // Artériopathie extra-cardiaque
    { id: 'aomi', type: 'boolean', label: 'Arteriopathie peripherique (AOMI, AVC, AIT)' },
    // Mobilité réduite (maladie neurologique sévère)
    { id: 'neuro', type: 'boolean', label: 'Mobilite reduite (maladie neurologique severe, AVC avec sequelles)' },
    // Chirurgie cardiaque antérieure
    { id: 'chir_redos', type: 'boolean', label: 'Chirurgie cardiaque anterieure (re-operation)' },
    // BPCO
    { id: 'bpco', type: 'boolean', label: 'BPCO severe (VEMS < 50% ou O2 domicile)' },
    // Endocardite active
    { id: 'endocardite', type: 'boolean', label: 'Endocardite active' },
    // État critique pré-opératoire
    { id: 'etat_critique', type: 'boolean', label: 'Etat critique pre-operatoire (TV, IABP, ventilation, insuffisance renale aigue)' },
    // IDM récent < 90 jours
    { id: 'post_idm', type: 'boolean', label: 'Post-infarctus recent (< 90 jours)' },
    // Urgence
    { id: 'urgence', type: 'radio', label: 'Urgence de l intervention',
      options: [
        { value: 0, label: 'Electif (programmee)' },
        { value: 1, label: 'Urgent (avant le prochain jour ouvrable)' },
        { value: 2, label: 'Urgence vitale (des que la salle est disponible)' },
        { value: 3, label: 'Sauvetage (massage cardiaque, assistance circulatoire au bloc)' },
      ] },
    // Type de chirurgie
    { id: 'type_chirurgie', type: 'radio', label: 'Type d intervention',
      options: [
        { value: 0, label: 'PAC isole (pontage coronarien)' },
        { value: 1, label: 'Chirurgie valvulaire isolee (hors PAC)' },
        { value: 2, label: 'Deux interventions combinees (PAC + valve, etc.)' },
        { value: 3, label: 'Trois interventions combinees ou plus' },
      ] },
    // Chirurgie de l\'aorte thoracique
    { id: 'chir_aorte', type: 'boolean', label: 'Chirurgie de l aorte thoracique' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 60
    const clcr = Number(values.clcr) || 85

    // EuroSCORE II — coefficients β (Nashef et al. 2012)
    const beta0 = -5.324537

    // 1. Age (continu)
    let logit = beta0 + 0.0285181 * age

    // 2. Sexe féminin
    if (values.sexe_feminin) logit += 0.3304495

    // 3. Clairance de la créatinine
    if (clcr < 50) logit += 1.153533
    else if (clcr <= 85) logit += 0.6251646

    // 4. Artériopathie extra-cardiaque
    if (values.aomi) logit += 0.4510641

    // 5. Mobilité réduite
    if (values.neuro) logit += 0.5350871

    // 6. Chirurgie cardiaque antérieure
    if (values.chir_redos) logit += 1.152595

    // 7. BPCO
    if (values.bpco) logit += 0.4391433

    // 8. Endocardite active
    if (values.endocardite) logit += 0.7875069

    // 9. État critique pré-opératoire
    if (values.etat_critique) logit += 0.9501162

    // 10. Diabète insulino-requérant
    if (values.diabete_insuline) logit += 0.4156515

    // 11. NYHA
    const nyha = Number(values.nyha) || 0
    if (nyha >= 1) logit += [0, 0.3486763, 0.6946655, 1.045024][nyha]

    // 12. CCS 4
    if (values.ccs4) logit += 0.3804332

    // 13. FEVG
    const fevg = Number(values.FEVG) || 0
    if (fevg === 1) logit += 0.3364837
    else if (fevg === 2) logit += 0.6983951
    else if (fevg === 3) logit += 1.021711

    // 14. IDM récent < 90 jours
    if (values.post_idm) logit += 0.4214507

    // 15. HTA pulmonaire
    if (values.hta_pulm) logit += 0.5250938

    // 16. Urgence
    const urgence = Number(values.urgence) || 0
    if (urgence === 1) logit += 0.4895883
    else if (urgence === 2) logit += 0.7699573
    else if (urgence === 3) logit += 1.262445

    // 17. Type de chirurgie
    const type_chir = Number(values.type_chirurgie) || 0
    if (type_chir === 1) logit += 0.3698606
    else if (type_chir === 2) logit += 0.6163302
    else if (type_chir === 3) logit += 0.8549371

    // 18. Chirurgie de l\'aorte thoracique
    if (values.chir_aorte) logit += 0.7175601

    const mortalite = Math.min(99, Math.max(0.1, Math.exp(logit) / (1 + Math.exp(logit)) * 100))
    const mortaliteRound = Math.round(mortalite * 10) / 10

    // Score approximatif additif (pour référence)
    const additiveScore = (() => {
      let s = 0
      if (age > 60) s += Math.floor((age - 60) / 5)
      if (values.sexe_feminin) s += 1
      if (clcr < 50) s += 3
      else if (clcr <= 85) s += 2
      if (values.aomi) s += 2
      if (values.neuro) s += 2
      if (values.chir_redos) s += 3
      if (values.bpco) s += 2
      if (values.endocardite) s += 3
      if (values.etat_critique) s += 3
      if (values.diabete_insuline) s += 2
      if (nyha >= 3) s += 3
      else if (nyha >= 2) s += 2
      else if (nyha >= 1) s += 1
      if (values.ccs4) s += 2
      if (fevg === 3) s += 3
      else if (fevg >= 1) s += 2
      if (values.post_idm) s += 1
      if (values.hta_pulm) s += 2
      if (urgence >= 2) s += 3
      else if (urgence >= 1) s += 2
      if (type_chir >= 2) s += 2
      else if (type_chir >= 1) s += 1
      if (values.chir_aorte) s += 2
      return s
    })()

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    if (mortalite < 2) severity = 'low'
    else if (mortalite < 5) severity = 'moderate'
    else if (mortalite < 10) severity = 'high'
    else severity = 'critical'

    return {
      value: additiveScore,
      label: `Risque de mortalite : ${mortaliteRound}%`,
      risk: mortaliteRound,
      riskUnit: '% mortalite operatoire (EuroSCORE II)',
      severity,
      details: {
        'Age': `${age} ans`,
        'Sexe feminin': values.sexe_feminin ? 'Oui' : 'Non',
        'CrCl': `${clcr} mL/min`,
        'FEVG': ['> 50%', '31-50%', '21-30%', '< 21%'][fevg],
        'NYHA': ['I', 'II', 'III', 'IV'][nyha],
        'CCS 4': values.ccs4 ? 'Oui' : 'Non',
        'Diabete insulino': values.diabete_insuline ? 'Oui' : 'Non',
        'HTAP': values.hta_pulm ? 'Oui' : 'Non',
        'Arteriopathie': values.aomi ? 'Oui' : 'Non',
        'Mobilite reduite': values.neuro ? 'Oui' : 'Non',
        'Reoperation': values.chir_redos ? 'Oui' : 'Non',
        'BPCO': values.bpco ? 'Oui' : 'Non',
        'Endocardite': values.endocardite ? 'Oui' : 'Non',
        'Etat critique': values.etat_critique ? 'Oui' : 'Non',
        'IDM recent': values.post_idm ? 'Oui' : 'Non',
        'Urgence': ['Electif', 'Urgent', 'Urgence vitale', 'Sauvetage'][urgence],
        'Type chirurgie': ['PAC isole', 'Valvulaire isole', 'Combinee (2)', 'Combinee (3+)'][type_chir],
        'Aorte thoracique': values.chir_aorte ? 'Oui' : 'Non',
        'Mortalite estimee': `${mortaliteRound}%`,
      },
      ranges: [
        { min: 0, max: 2, label: 'Risque faible (< 2 %)', severity: 'low', recommendation: 'Chirurgie envisagee sans sur-risque majeur. Surveillance post-operatoire standard.' },
        { min: 2, max: 5, label: 'Risque modere (2-5 %)', severity: 'moderate', recommendation: 'Optimisation pre-operatoire. Soins intensifs post-operatoires systematiques.' },
        { min: 5, max: 10, label: 'Risque eleve (5-10 %)', severity: 'high', recommendation: 'Discussion multidisciplinaire. Optimiser etat clinique avant chirurgie. Alternatives percutanees a discuter.' },
        { min: 10, max: 100, label: 'Risque tres eleve (> 10 %)', severity: 'critical', recommendation: 'Risque prohibitif. Discuter alternatives (TAVI, angioplastie, traitement medical). Reunion de concertation pluridisciplinaire.' },
      ],
    }
  },
  interpretation: 'L\'**EuroSCORE II** (Nashef et al. 2012) predit la mortalite operatoire en chirurgie cardiaque. Il remplace l\'EuroSCORE I (1999) qui surestimait le risque chez les patients a haut risque.\n\n**18 facteurs de risque :** age, sexe, CrCl, FEVG, NYHA, CCS 4, diabete insulino, HTAP, arteriopathie, mobilite reduite, reoperation, BPCO, endocardite, etat critique, IDM recent, urgence, type d\'intervention, chirurgie aorte.\n\n**Seuils de risque :** < 2% faible, 2-5% modere, 5-10% eleve, > 10% tres eleve.',
  clinicalCommentary: "L\'EuroSCORE II est le standard actuel recommandé par les sociétés savantes (ESC/EACTS). Il a été développé à partir d\'une base de 16 828 patients européens (2010). Il est plus performant que l\'EuroSCORE I logistique pour les patients à haut risque. Ce calculateur implémente la version logistique complète (β coefficients).",
  references: [
    {
      type: 'pubmed',
      title: 'Nashef SA et al. EuroSCORE II. Eur J Cardiothorac Surg 2012',
      pmid: '22679151',
    },
  ],
}
export default euroscore2
