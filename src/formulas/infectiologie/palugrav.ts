import type { FormulaDefinition } from '../types'

const palugrav: FormulaDefinition = {
  id: 'palugrav',
  slug: 'palugrav',
  name: 'Paludisme, gravité (Critères)',
  specialty: 'infectiologie',
  category: 'Paludisme',
  description: 'Critères OMS 2020 de gravité du paludisme à Plasmodium falciparum pour définir le paludisme grave.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'neuropaludisme',
      type: 'boolean',
      label: 'Neuropaludisme (Glasgow < 11, coma, convulsions répétées)',
      weight: 1,
    },
    {
      id: 'detresse_resp',
      type: 'boolean',
      label: 'Détresse respiratoire (PaO₂ < 60 mmHg, SpO₂ < 92 %, FR > 30/min)',
      weight: 1,
    },
    {
      id: 'ictere',
      type: 'boolean',
      label: 'Ictère (bilirubine > 50 µmol/L)',
      weight: 1,
    },
    {
      id: 'choc',
      type: 'boolean',
      label: 'Choc (PAS < 80 mmHg malgré remplissage)',
      weight: 1,
    },
    {
      id: 'insuff_renale',
      type: 'boolean',
      label: 'Insuffisance rénale aiguë (créatinine > 265 µmol/L ou diurèse < 0.4 mL/kg/h)',
      weight: 1,
    },
    {
      id: 'anemie_severe',
      type: 'boolean',
      label: 'Anémie sévère (Hb < 7 g/dL, < 5 g/dL si enfant)',
      weight: 1,
    },
    {
      id: 'hypoglycemie',
      type: 'boolean',
      label: 'Hypoglycémie < 2.2 mmol/L',
      weight: 1,
    },
    {
      id: 'acidose',
      type: 'boolean',
      label: 'Acidose métabolique (HCO₃ < 15 mmol/L, lactates > 5 mmol/L)',
      weight: 1,
    },
    {
      id: 'coagulopathie',
      type: 'boolean',
      label: 'Coagulopathie (plaquettes < 50 000/mm³, CIVD)',
      weight: 1,
    },
    {
      id: 'parasitemie',
      type: 'boolean',
      label: 'Parasitémie > 10 %',
      weight: 1,
    },
  ],
  calculate: (values) => {
    const criteres = [
      values.neuropaludisme ? 1 : 0,
      values.detresse_resp ? 1 : 0,
      values.ictere ? 1 : 0,
      values.choc ? 1 : 0,
      values.insuff_renale ? 1 : 0,
      values.anemie_severe ? 1 : 0,
      values.hypoglycemie ? 1 : 0,
      values.acidose ? 1 : 0,
      values.coagulopathie ? 1 : 0,
      values.parasitemie ? 1 : 0,
    ]
    const total = criteres.reduce((a, b) => a + b, 0)

    const paludismeGrave = total >= 1 // 1 critère suffit

    return {
      value: total,
      label: paludismeGrave
        ? `PALUDISME GRAVE — ${total} critère(s) de gravité OMS présent(s)`
        : 'Paludisme simple — aucun critère de gravité',
      severity: paludismeGrave ? 'critical' : 'low',
      details: {
        'Neuropaludisme': values.neuropaludisme ? 'Oui' : 'Non',
        'Détresse respiratoire': values.detresse_resp ? 'Oui' : 'Non',
        'Ictère': values.ictere ? 'Oui' : 'Non',
        'Choc': values.choc ? 'Oui' : 'Non',
        'IRA': values.insuff_renale ? 'Oui' : 'Non',
        'Anémie sévère': values.anemie_severe ? 'Oui' : 'Non',
        'Hypoglycémie': values.hypoglycemie ? 'Oui' : 'Non',
        'Acidose': values.acidose ? 'Oui' : 'Non',
        'Coagulopathie': values.coagulopathie ? 'Oui' : 'Non',
        'Parasitémie > 10 %': values.parasitemie ? 'Oui' : 'Non',
      },
      ranges: [
        { min: 0, max: 0, label: 'Paludisme simple', severity: 'low', recommendation: 'Traitement antipaludique per os : artéméther-luméfantrine (Riamet) ou atovaquone-proguanil (Malarone). Surveillance ambulatoire sauf vomissements.' },
        { min: 1, max: 3, label: 'Paludisme grave (1-3 critères)', severity: 'critical', recommendation: 'HOSPITALISATION EN URGENCE. Traitement parentéral : artésunate IV (2.4 mg/kg à H0, H12, H24 puis 1/j). Surveillance rapprochée : glycémie, créatinine, Hb, lactate, parasitemie. Transfert en réanimation si défaillance d organe.' },
        { min: 4, max: 10, label: 'Paludisme très grave (≥ 4 critères)', severity: 'critical', recommendation: 'RÉANIMATION. Artésunate IV. Traitement des défaillances : dialyse, ventilation, vasopresseurs, transfusion. Pronostic vital engagé. Mortalité > 20 %.' },
      ],
    }
  },
  interpretation: `Les **critères OMS de gravité du paludisme** (2020) définissent le paludisme grave à *Plasmodium falciparum*.

**Un seul critère suffit** pour définir le paludisme grave :

1. Neuropaludisme (Glasgow < 11)
2. Détresse respiratoire
3. Ictère (bilirubine > 50 µmol/L)
4. Choc
5. IRA (créatinine > 265 µmol/L)
6. Anémie sévère (Hb < 7 g/dL)
7. Hypoglycémie (< 2.2 mmol/L)
8. Acidose métabolique
9. Coagulopathie
10. Parasitémie > 10 %

**Traitement de référence : artésunate IV** (dès la suspicion de paludisme grave).`,
  clinicalCommentary: `Le paludisme grave est une URGENCE VITALE. L artésunate IV a remplacé la quinine (meilleure tolérance, réduction de la mortalité de 30 %). Le traitement parentéral doit être débuté sans attendre les résultats biologiques. La surveillance de la glycémie est cruciale (hypoglycémies fréquentes). Les enfants et les femmes enceintes sont les plus vulnérables. En zone d endémie, tout syndrome fébrile avec signe de gravité = paludisme grave jusqu à preuve du contraire.`,
  references: [
    {
      type: 'pubmed',
      title: 'WHO. Guidelines for the treatment of malaria, 3rd edition 2020',
      pmid: '32462732',
    },
    {
      type: 'guideline',
      title: 'OMS — Prise en charge du paludisme grave (Guide 2021)',
      url: 'https://www.who.int/malaria',
    },
  ],
}
export default palugrav
