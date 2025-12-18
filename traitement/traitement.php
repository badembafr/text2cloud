<?php
// JSON pour la réponse
header('Content-Type: application/json');

// Récupération du texte
$texteBrut = "";
if (isset($_POST['texte_saisie'])) {
    $texteBrut = $_POST['texte_saisie'];
}

// Statistiques du texte brut
$nbCaracteres = mb_strlen($texteBrut, 'UTF-8');

// Chargement des mots vides
$motsVides = chargerMotsVides();

// Tokenisation du texte
$separateurs = " ,.;''(«»):!?–€\n\r\t";
$tabMotsBruts = fragmenter($separateurs, $texteBrut);

// Comptage des mots total
$nbMotsTotal = compterMotsTotal($tabMotsBruts);

// Nettoyage et comptage des occurrences
$compteur = nettoyerEtCompter($tabMotsBruts, $motsVides);

// Tri par fréquence décroissante
arsort($compteur);

// Calcul nombre de mots dans le nuage 
$nbMotsNuage = count($compteur);

// Préparation des données pour le JSON
$donneesMots = preparerDonneesMots($compteur);

$statistiques = [
    'nb_caracteres' => $nbCaracteres,
    'nb_mots_total' => $nbMotsTotal,
    'nb_mots_uniques' => count($compteur),
    'nb_mots_nuage' => $nbMotsNuage
];

// Réponse finale
$reponse = [
    'mots' => $donneesMots,
    'stats' => $statistiques
];

echo json_encode($reponse);


// Charge les mots vides depuis le fichier
function chargerMotsVides() {
    $motsVides = [];
    if (file_exists('mots-vides.txt')) {
        $motsVides = array_map('trim', explode("\n", file_get_contents('mots-vides.txt')));
    }
    return $motsVides;
}

// Découpe le texte en mots
function fragmenter($separateurs, $texte) {
    $tok = strtok($texte, $separateurs);
    $tab_tok[] = $tok;
    
    while ($tok !== false) {
        $tok = strtok($separateurs);
        $tab_tok[] = $tok;
    }
    return $tab_tok;
}

// Compte le nombre total de mots
function compterMotsTotal($tabMots) {
    return count(array_filter($tabMots, function($mot) {
        return trim($mot) !== '';
    }));
}

// Nettoie et compte les occurrences
function nettoyerEtCompter($tabMots, $motsVides) {
    $compteur = [];
    
    foreach ($tabMots as $mot) {
        // Conversion en minuscule
        $mot = mb_strtolower($mot, 'UTF-8');
        $mot = trim($mot);

        // Enlever uniquement les points d'interrogation en début/fin
        $mot = preg_replace('/^\?+|\?+$/u', '', $mot);

        // Filtre: mots > 2 caractères et pas dans mots vides
        if ($mot !== '' && mb_strlen($mot) > 2 && !in_array($mot, $motsVides)) {
            if (!isset($compteur[$mot])) {
                $compteur[$mot] = 0;
            }
            $compteur[$mot]++;
        }
    }
    
    return $compteur;
}

// Prépare les données pour le JSON
function preparerDonneesMots($compteur) {
    $donnees = [];
    foreach ($compteur as $mot => $frequence) {
        $donnees[] = [
            'mot' => $mot,
            'frequence' => $frequence
        ];
    }
    return $donnees;
}
?>