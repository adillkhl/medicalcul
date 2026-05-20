import type { FormulaDefinition } from '../types'

const selle: FormulaDefinition = {
  id: 'selle',
  slug: 'selle',
  name: 'Échelle de Selle (Saddle Area) — Anesthésie en Selle',
  specialty: 'neurologie',
  category: 'Neurologie',
  description: 'Évaluation de la sensibilité de la région en selle (périnée) dans le syndrome de la queue-de-cheval (score 0–8)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'toucher_pereine',
      type: 'radio',
      label: 'Sensibilité au toucher léger de la région péri-anale',
      options: [
        { value: 2, label: '2 — Normale (sensation préservée)' },
        { value: 1, label: '1 — Diminuée (hypoesthésie)' },
        { value: 0, label: '0 — Absente (anesthésie)' },
      ],
    },
    {
      id: 'pigüre_pereine',
      type: 'radio',
      label: 'Sensibilité à la piqûre (région péri-anale)',
      options: [
        { value: 2, label: '2 — Normale' },
        { value: 1, label: '1 — Diminuée (hypoalgésie)' },
        { value: 0, label: '0 — Absente (analgésie)' },
      ],
    },
    {
      id: 'toucher_organes',
      type: 'radio',
      label: 'Sensibilité des organes génitaux externes',
      options: [
        { value: 2, label: '2 — Normale' },
        { value: 1, label: '1 — Diminuée' },
        { value: 0, label: '0 — Absente' },
      ],
    },
    {
      id: 'reflexe_bulbaire',
      type: 'radio',
      label: 'Réflexe bulbo-caverneux (contraction anale à la compression du gland/clitoris)',
      options: [
        { value: 2, label: '2 — Présent (normal)' },
        { value: 1, label: '1 — Diminué' },
        { value: 0, label: '0 — Absent' },
      ],
    },
  ],
  calculate: (values) => {
    const toucherPerine = values.toucher_pereine ?? 0
    const pigürePerine = values.pigüre_pereine ?? 0
    const toucherOrganes = values.toucher_organes ?? 0
    const reflexeBulbaire = values.reflexe_bulbaire ?? 0

    const total = toucherPerine + pigürePerine + toucherOrganes + reflexeBulbaire

    const severity = total >= 6 ? 'low' : total >= 4 ? 'moderate' : total >= 2 ? 'high' : 'critical'

    const label = total >= 6 ? 'Fonction sacrale normale' :
      total >= 4 ? 'Atteinte sacrale partielle légère' :
      total >= 2 ? 'Atteinte sacrale modérée' :
      total < 2 && total > 0 ? 'Atteinte sacrale sévère' :
      'Anesthésie en selle complète — Syndrome de queue-de-cheval probable'

    return {
      value: total,
      label,
      severity,
      details: { Toucher_périnée: toucherPerine, Piqûre_périnée: pigürePerine, Sensibilité_génitale: toucherOrganes, Réflexe_bulbocaverneux: reflexeBulbaire },
      ranges: [
        { min: 6, max: 8, label: 'Score 6–8 — Fonction sacrale normale', severity: 'low', recommendation: 'Pas d\'atteinte sacrale significative. Surveillance clinique.' },
        { min: 4, max: 5, label: 'Score 4–5 — Atteinte sacrale partielle légère', severity: 'moderate', recommendation: 'IRM lombo-sacrée urgente si contexte de lombalgie aiguë avec signes radiculaires. Surveillance des fonctions vésico-sphinctériennes.' },
        { min: 2, max: 3, label: 'Score 2–3 — Atteinte sacrale modérée', severity: 'high', recommendation: 'IRM lombo-sacrée en URGENCE. Bilan urodynamique. Avis neurochirurgical urgent en cas de syndrome de queue-de-cheval. Prévenir rétention urinaire (palpation vésicale, sondage si besoin).' },
        { min: 0, max: 1, label: 'Score 0–1 — Anesthésie en selle complète / sévère', severity: 'critical', recommendation: 'URGENCE NEUROCHIRURGICALE — Syndrome de queue-de-cheval probable. IRM lombo-sacrée immédiate. Avis neurochirurgical en urgence. Prise en charge des troubles vésico-sphinctériens (sondage évacuateur). La chirurgie décompressive doit être réalisée dans les 24–48h pour optimiser la récupération.' },
      ],
    }
  },
  interpretation: `L'**échelle de Selle** (Saddle Area Scale) évalue la fonction sacrale dans le syndrome de la queue-de-cheval (cauda equina syndrome). C'est une urgence neurochirurgicale.

**4 items (score 0–8) :**
1. Sensibilité au toucher de la région péri-anale (0–2)
2. Sensibilité à la piqûre de la région péri-anale (0–2)
3. Sensibilité des organes génitaux externes (0–2)
4. Réflexe bulbo-caverneux (0–2)

**Interprétation :**
- 6–8 : normal
- 4–5 : atteinte légère
- 2–3 : atteinte modérée
- 0–1 : atteinte sévère (anesthésie en selle)

L'anesthésie en selle est un signe d’alarme majeur de compression de la queue-de-cheval, associée à des douleurs radiculaires, des troubles sphinctériens et un déficit moteur des membres inférieurs.`,
  clinicalCommentary: `L'anesthésie en selle est un signe d'URGENCE NEUROCHIRURGICALE qui doit faire pratiquer une IRM lombo-sacrée en urgence. Les causes principales : hernie discale lombaire massive, tumeur, hématome, traumatisme. Le réflexe bulbo-caverneux est très spécifique de l’atteinte sacrale (S2–S4). La chirurgie décompressive avant 24–48h améliore le pronostic. Ne pas oublier l'évaluation des fonctions vésico-sphinctériennes (globe vésical, incontinence urinaire/fécale).`,
  references: [
    {
      type: 'pubmed',
      title: 'Gleave JRW, Macfarlane R. Cauda equina syndrome: what is the relationship between timing of surgery and outcome? Br J Neurosurg 2002',
      pmid: '12587876',
    },
    {
      type: 'pubmed',
      title: 'Todd NV. Guidelines for cauda equina syndrome. Br J Neurosurg 2005',
      pmid: '16245764',
    },
  ],
}

export default selle
