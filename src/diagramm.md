```mermaid
usecaseDiagram
    actor Bibliothekar as B
    actor Mitglied as M
    actor Gast as G

    rectangle Bibliothekssystem {
        (Buch hinzufügen) as add
        (Buch entfernen) as delete
        (Ausleihe verwalten) as manage
        (Buch suchen) as search
        (Buch ausleihen) as borrow
        (Buch verlängern) as renew

        B --> add
        B --> delete
        B --> manage
        M --> search
        M --> borrow
        M --> renew
        G --> search
    }
```