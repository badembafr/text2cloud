// Variables globales pour stocker les données
let donneesGlobales = [];
let motsAffiches = 10;
// Limite d'affichage du nuage (front-end seulement)
const MAX_NUAGE = 80;

// Texte area
const textarea = document.getElementById('texte_area');

// Gestion du fichier : charge le contenu dans le textarea
document.getElementById('fichier_input').addEventListener('change', function(e) {
    let fichier = e.target.files[0];
    if (fichier) {
        let lecteur = new FileReader();
        lecteur.onload = function(event) {
            textarea.value = event.target.result;
        };
        lecteur.readAsText(fichier);
    }
});

// Gestion du menu de téléchargement (PNG/JPEG)
document.getElementById('btn-download-toggle').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('format-menu').classList.toggle('show');
});

// Ferme le menu si on clique ailleurs
document.addEventListener('click', function() {
    document.getElementById('format-menu').classList.remove('show');
});

// Bouton réinitialiser : remet tout à zéro
document.getElementById('btn-reset').addEventListener('click', function() {
    textarea.value = '';
    document.getElementById('fichier_input').value = '';
    document.getElementById('resultats').style.display = 'none';
    donneesGlobales = [];
    motsAffiches = 10;
    this.classList.add('hidden');
});

// Gestion du bouton "scroll to top"
window.addEventListener('scroll', function() {
    let scrollBtn = document.getElementById('scroll-top');
    if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Soumission du formulaire : génération du nuage
document.getElementById('monFormulaire').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let texte = textarea.value.trim();
    
    // Validation : le texte ne doit pas être vide
    if (!texte) {
        alert('Veuillez saisir ou charger un texte avant de générer le nuage.');
        return;
    }
    
    // Envoi au serveur PHP
    let formData = new FormData();
    formData.append('texte_saisie', texte);
    
    fetch('traitement/traitement.php', {
        method: 'POST',
        body: formData
    })
    .then(reponse => reponse.json()) 
    .then(data => {
        if (data.mots.length === 0) {
            alert('Aucun mot trouvé dans le texte.');
            return;
        }
        
        // Affichage des résultats
        document.getElementById('resultats').style.display = "block";
        document.getElementById('btn-reset').classList.remove('hidden');
        donneesGlobales = data.mots;
        motsAffiches = 10;
        
        // Génération du nuage et des statistiques
        setTimeout(() => { 
            genererNuage(data.mots);
            afficherStatistiques(data.stats);
            document.getElementById('resultats').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        afficherTableau(motsAffiches);
    })
    .catch(erreur => {
        console.error('Erreur:', erreur);
        alert('Erreur lors du traitement du texte.');
    });
});

// Génération du nuage de mots (version plus concise)
function genererNuage(data) {
    if (!data || data.length === 0) return;

    const canvas = document.getElementById('mon_canvas');
    const wrapper = document.getElementById('wrapper');

    // adapter la taille du canvas au conteneur (pour affichage net)
    canvas.width = wrapper.offsetWidth * 2;
    canvas.height = wrapper.offsetHeight * 2;

    // prendre au maximum MAX_NUAGE mots côté client
    const slice = data.slice(0, Math.min(MAX_NUAGE, data.length));
    const nbMots = slice.length;
    const maxFreq = slice[0].frequence;
    const minFreq = slice[nbMots - 1].frequence;

    const listePourNuage = slice.map(item => {
        const ratio = (item.frequence - minFreq) / (maxFreq - minFreq || 1);
        const tailleBase = nbMots > 50 ? 55 : 65;
        return [item.mot, Math.floor(12 + ratio * tailleBase)];
    });

    const couleurs = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F8B500','#FF85A2','#6C5CE7','#00B894','#FDCB6E','#E17055','#74B9FF'];

    WordCloud(canvas, {
        list: listePourNuage,
        gridSize: 8,
        weightFactor: 2.8,
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: () => couleurs[Math.floor(Math.random() * couleurs.length)],
        backgroundColor: 'transparent',
        rotateRatio: 0,
        shrinkToFit: false,
        minSize: 10,
        shape: 'circle',
        ellipticity: 0.75
    });
}

// Affichage des statistiques du texte
function afficherStatistiques(stats) {
    let statsBox = document.getElementById('stats-box');
    // Calcul du "gain" en pourcentage : (total - uniques) / total * 100
    const totalMots = stats.nb_mots_total || 0;
    const diffUnique = Math.max(0, totalMots - (stats.nb_mots_uniques || 0));
    const pourcentage = totalMots > 0 ? ((diffUnique / totalMots) * 100) : 0;
    // Formattage avec une décimale
    const pourcentageAffiche = Number.isInteger(pourcentage) ? `${pourcentage}%` : `${pourcentage.toFixed(1)}%`;

    // Ordre demandé (mis à jour) : mots au total -> mots uniques -> gain (%)
    statsBox.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${totalMots}</div>
            <div class="stat-label">Mots au total</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.nb_mots_uniques}</div>
            <div class="stat-label">Mots uniques</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${pourcentageAffiche}</div>
            <div class="stat-label">Gain (%)</div>
        </div>
    `;

    // Affiche le nombre de caractères de façon compacte sous les statistiques
    const smallCharElem = document.getElementById('small-char-count');
    if (smallCharElem) {
        smallCharElem.textContent = `Nombre de caractères : ${stats.nb_caracteres}`;
    }
}

// Affichage du tableau des occurrences
function afficherTableau(limite) {
    let tbody = document.getElementById('corps-tableau');
    let btnVoirPlus = document.getElementById('btn-voir-plus');
    tbody.innerHTML = ""; 
    
    let max = Math.min(limite, donneesGlobales.length);
    
    for(let i = 0; i < max; i++) {
        let item = donneesGlobales[i];
        tbody.innerHTML += `<tr>
            <td>${item.mot}</td>
            <td><strong>${item.frequence}</strong></td>
        </tr>`;
    }
    
    // Bouton "Afficher plus" si nécessaire
    if (donneesGlobales.length > max) {
        btnVoirPlus.classList.remove('hidden');
        btnVoirPlus.textContent = `Afficher plus (+100 mots) ▼`;
        btnVoirPlus.onclick = function() { 
            motsAffiches += 100;
            afficherTableau(motsAffiches);
        };
    } else {
        btnVoirPlus.classList.add('hidden');
    }
}

// Téléchargement du nuage en PNG ou JPEG
function telechargerNuage(format) {
    let canvas = document.getElementById('mon_canvas');
    let mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    let extension = format === 'png' ? 'png' : 'jpg';
    
    let link = document.createElement('a');
    link.download = `nuage-mots.${extension}`;
    link.href = canvas.toDataURL(mimeType, 0.95);
    link.click();
    
    document.getElementById('format-menu').classList.remove('show');
}

// Téléchargement des occurrences (CSV simple)
function telechargerOccurrences() {
    if (!donneesGlobales || donneesGlobales.length === 0) {
        alert('Aucune occurrence disponible à télécharger.');
        return;
    }

    // Préparer CSV : en-tête + lignes mot,occurrences
    let lignes = ['mot,occurrences'];
    donneesGlobales.forEach(item => {
        // Échapper les virgules et guillemets basiques
        const mot = String(item.mot).replace(/"/g, '""');
        const freq = item.frequence;
        lignes.push(`"${mot}",${freq}`);
    });

    const contenu = lignes.join('\n');
    const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'occurrences.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Liaison du bouton de téléchargement des occurrences
document.getElementById('btn-download-occurrences').addEventListener('click', function() {
    telechargerOccurrences();
});
    
// Redessine le nuage si la fenêtre est redimensionnée
window.addEventListener('resize', function() {
    if (donneesGlobales.length > 0) {
        genererNuage(donneesGlobales);
    }
});