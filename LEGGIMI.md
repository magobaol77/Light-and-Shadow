# Recycle Combo e Recycle Domino

Apri index.html oppure Apri il gioco.cmd. Nel menu iniziale scegli una delle due versioni. Cataloghi, partita, annullamento e salvataggio sono separati. Il salvataggio Combo preesistente resta disponibile.

Combo conserva le tessere e gli effetti modificati il 22 settembre 2026.

Domino usa esclusivamente 1.1/TESSERE_LUCE_OMBRA_NUOVA_VERSIONE.xlsx: 56 Luce e 30 Ombra, con 83 Alberi, 36 Animali, 14 Batterie e 70 Immondizie. I valori attesi del foglio non sono punti reali di gioco. I dati sono incorporati in domino-cards.js e non si aggiornano automaticamente modificando il foglio.

Setup comune: partenza Luce casuale, 2 Batterie più quelle della tessera iniziale, due display da quattro tessere, bussola al valore iniziale. Luce richiede un valore superiore, Ombra inferiore. Una Batteria consente un passo a sinistra senza consumare il turno. Il regno cresce per adiacenza ortogonale entro 4 righe e 4 colonne e termina a 16 tessere.

Domino: ogni Animale dà 1 PV. Ogni area connessa di un bioma dà numero di tessere × Alberi contenuti. Anche le tessere Ombra ampliano il bioma corrispondente. Nero è neutro. Le icone Batteria danno risorse subito, senza punti diretti.

Il riepilogo mostra anche la quantità di Immondizie nel cumulo connesso più grande, nella riga più sporca e nella colonna più sporca. Nel solitario il totale esclude confronti con avversari. Il multigiocatore e gli automi restano da implementare, come nella versione Combo. Il motore espone il confronto fra griglie: maggioranza Animali +2, e per ciascuna classifica Immondizie -5/-2. Parità e applicazione in solitario restano da confermare con l’autore prima del multigiocatore.
