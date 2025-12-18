<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>P8 Text 2 Cloud</title>
    <link rel="icon" type="image/png" href="img/logo.png">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.2.2/wordcloud2.min.js"></script>
    <link rel="stylesheet" href="style/styles.css">
</head>
<body>
    <div class="conteneur">
            <div class="header">
            <img src="img/logo.png" alt="Logo" onerror="this.style.display='none'">
            <h1>P8 Text 2 Cloud</h1>
        </div>
        
        <div class="box-saisie">
            <!-- Source de données -->
            <form id="monFormulaire">
                <div class="form-group">
                    <label>1. Choisir un fichier (TXT)</label>
                    <input type="file" name="fichier_texte" accept=".txt" id="fichier_input">
                </div>
                
                <div class="form-group">
                    <label>2. Tapez ou collez du texte :</label>
                    <textarea name="texte_saisie" id="texte_area" placeholder="Collez votre texte ici..."></textarea>
                </div>
                
                <div class="btn-group">
                    <button type="submit" id="btn-generer">Générer le nuage de mots-clés</button>
                    <button type="button" class="btn-reset hidden" id="btn-reset">Réinitialiser</button>
                </div>
            </form>
        </div>
        
        <div id="resultats">
            <!-- Affichage du nuage de mots-clés -->
            <div class="header-resultat">
                <h3>Nuage de mots-clés</h3>
                <div class="download-options">
                    <button class="btn-download" id="btn-download-toggle">Télécharger l'image ▼</button>
                    <div class="format-menu" id="format-menu">
                        <div class="format-option" onclick="telechargerNuage('png')">Format PNG</div>
                        <div class="format-option" onclick="telechargerNuage('jpeg')">Format JPEG</div>
                    </div>
                </div>
            </div>
            <div class="canvas-wrapper" id="wrapper">
                <canvas id="mon_canvas"></canvas>
            </div>
            
            <!-- Statistiques du texte -->
            <h3 style="margin-bottom: 0px;">Statistiques du texte</h3>
            <p id="small-char-count" class="small-stat"></p>
            <div class="stats-box" id="stats-box"></div>
            
            <div class="header-resultat">
                <h3>Détails des occurrences</h3>
                <div class="download-options">
                    <button class="btn-download" id="btn-download-occurrences">Télécharger les occurrences</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Mot</th>
                        <th>Occurrences</th>
                    </tr>
                </thead>
                <tbody id="corps-tableau"></tbody>
            </table>
            <button id="btn-voir-plus" class="btn-voir-plus hidden">Afficher plus (+100 mots) ▼</button>
        </div>
    </div>

    <button class="scroll-top" id="scroll-top" onclick="scrollToTop()">↑</button>
    <script src="script/app.js"></script>
</body>
</html>