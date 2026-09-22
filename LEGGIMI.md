# Light & Shadow

Apri index.html oppure Apri il gioco.cmd. L’app funziona offline.

Menu iniziale: cataloghi delle 56 tessere Luce e 30 Ombra, solitario e configurazione futura per 2/3/4 giocatori umani o automi.

Il regno nasce da una tessera casuale piazzata al centro e cresce per adiacenza ortogonale, entro 4 righe e 4 colonne. La partita termina a 16 tessere. Luce: valore strettamente superiore alla bussola. Ombra: valore strettamente inferiore. La bussola arriva sul valore scelto senza ritorno circolare. Spendere 1 Batteria consente un passo a sinistra, senza consumare il turno, fino al minimo 1. Annulla azione ripristina anche le Batterie.

I confini di centro, bordo e angoli sono quelli dell’area attualmente occupata: i punteggi sono provvisori durante la crescita. Gli effetti istantanei usano i confini al piazzamento e non si riattivano. Queste convenzioni sono descritte anche nelle regole dell’app. Nessuna mossa legale e nessuna Batteria utilizzabile: l’app segnala il blocco, senza introdurre rifornimenti o passaggi non previsti.

I salvataggi della nuova versione usano una chiave separata; le partite della vecchia griglia fissa non vengono caricate né cancellate. La configurazione multigiocatore resta conservata.

Dati: TILES_RIBILANCIATE_INTENZIONALITA.xlsx, incorporati in cards.js. Il foglio non aggiorna automaticamente l’app. Verifiche del motore: node test.cjs.
