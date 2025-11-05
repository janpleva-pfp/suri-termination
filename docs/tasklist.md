# Tasklist Checklist

### 1. Zprovoznit FE do finalni podoby pro odeslanai na vygenerovani PDF a zobrazeni podpisove casti.

1. - [x] Layout a obalka pro suri stylovani.
2. - [x] Formulare nase s validacemi + validovatelny obsah s hlaskami.
3. - [x] Odeslani na BE
   1. - [x] zalozeni link builderu (api existuje overit ze se vyplnuji defaultovane udaje)
   2. - [x] odeslani na CRM (api existuje).
   3. - [x] vygenerovani PDF (api existuje).

### 2. FE pro obrazovku s podpisem.

1. - [x] Readonly pohled na zadana data v bode 1 s moznosti prokliku zpet do editace a ulozeni do jiz existujiciho linkbuilderu.
2. - [x] Funkcni podpisovy vstup.
3. - [x] Odeslani na BE - vygenerovani PDF s podpisem a drzeni base64 na FE - novy endpoint pro odbaveni finalniho odeslani.
   1. - [x] vycisteni
   2. - [x] validace
   3. - [x] ziskani base64 dat.

### 3. ResultPage na url "/shrnuti.tsx".

1. - [x] Zavest konstantu pro seznam klicu pojistoven (csob, cpp, direct, hvp, pillow, pvzp) a konstantu pro duvody vyzadujiici doklad: "vyrazeni z registru", "zmena vlastnika", "odcizeni vozidla".
2. - [x] Implementace result obrazovky "Uzivatel dokoncuje sam" (duvod vypovedi neni v konstante).
3. - [x] Implementace result obrazovky "Uzivatel dokoncuje sam - vcetne zaslani dokumentu" (duvody v konstante).
4. - [x] Mazu stav a implementace logiky co me po refresh obrazovky posle na zacatek.
5. - [x] Nacitani dat na kroku 1 do defaultu formulare kdyz je v url linkId; kdyz vse vyplneno, rovnou zobrazit krok s podpisem.

### 4. Rozsireni noveho endpointu finalniho odeslani (zatim pouze generuje PDF s podpisem).

1. - [x] Stahnout linkbuilder a prevest na datovou strukturu pro CRM request (viz 1.3) + pridat: needAttachment, terminationState=clientSelf, linkId, terminationFileUrl (BUCKET_GET_URL + nazev souboru), terminationFileTime. Pokud linkbuilder obsahuje "properties", predat 1:1. Pro Inovis request prijimat token z hlavicky.

### 5. Nahrani PDF do cloudu. Dointegrovat do bodu 4 samotne nahrani a doriesit predani spravneho nazvu/cesty k PDF v cloudu do CRM requestu.

1. - [x] Nahrani PDF do cloudu a dorazeni spravneho nazvu/cesty do CRM requestu.

### 6. Uprava prepinani obsahu result page /shrnuti pokud appstate.linkbuilder obsahuje neprazdny "properties.agent.userName". Vsechna vyhodnoceni dat umistit do funkci pokrytych testy.

1. - [x] Pokud provider=uniqa -> result page: "Dokonceni za uzivatele" (figma).
2. - [x] Pokud provider=slavia/allianz/gcp a duvod vypovedi NENI v konstantach z 3.1 -> "Dokonceni za uzivatele".
3. - [x] Pokud provider=slavia/allianz/gcp a duvod odpovida nekteremu z konstant z 3.1 -> "Dokonceni za uzivatele - uzivatel nam musi doposlat dokument".
4. - [x] Pokud provider v konstantach z 3.1 -> chovani podle 3.2 a 3.3.

### 7. Uprava requestu na CRM (bod 4) s ohledem na logiku z bodu 6.

- tohle je určitě na prokontrolování, jestli jsem to nejak nepokazil

1. - [x] Pokud 6.1 -> terminationState=clientSigned.
2. - [x] Pokud 6.2 -> terminationState=sentToInsurer.
3. - [x] Pokud 6.3 -> terminationState=waitingDocuments.
4. - [x] Pokud 6.4 -> terminationState se nemeni.

### 8. Odesilani emailu - rozsireni logiky api endpointu "/api/termination". Odeslani emailu predchazi volani CRM. Pokud odeslani emailu skonci chybou, vratit error response.

1. - [ ] Obecne: objectType=terminate2025, linkToObject=true, securityHash (vytvorit dle openapi, s EMAIL_SALT), data=podmnozina linkbuilder dat, email.sender={properties.agent.email || "info@[website]"}, email.subject.value doplnit contractNumber, email.body.parameters.emailTerminateType="terminate2025", email.attachments=base64 PDF s podpisem.
2. - [ ] 8.1) Pokud neni properties.agent NEBO properties.agent existuje a provider v konstante 3.1 -> emailType=instructionsToClient, recipients=policyholder.email, body.path="pfp/email/terminate/instructionsToClient", body.parameters.terminateFinisher=client. Po uspechu volat CRM (7.4).
3. - [ ] 8.2) Pokud properties.agent a provider=uniqa -> emailType=terminateToBackoffice, sender=properties.agent.email, recipients="info@[website]", body.path="pfp/email/terminate/terminateToBackoffice", body.parameters.terminateFinisher=undefined. Po uspechu volat CRM (7.1).
4. - [ ] 8.3) Pokud properties.agent a provider=slavia/allianz/gcp a duvod v konstantach 3.1 -> emailType=terminateToBackoffice, sender=properties.agent.email, recipients="info@[website]", body.path="pfp/email/terminate/terminateToBackoffice", body.parameters.terminateFinisher=undefined. Po uspechu volat CRM (7.3).
5. - [ ] 8.4) Pokud properties.agent a provider=slavia/allianz/gcp a duvod NENI v konstantach 3.1 -> poslat dve email zpravy; po obou uspechu volat CRM (7.2).
   1. - [ ] 8.4.1) Prvni: emailType=terminateToInsurer, sender="info@[website]", recipients=provider.email, body.path="pfp/email/terminate/terminateToInsurer", body.parameters.terminateFinisher=undefined.
   2. - [ ] 8.4.2) Druhy: emailType=instructionsToClient, sender="info@dokumenty.[website]", body.path="pfp/email/terminate/instructionsToClient", body.parameters.terminateFinisher=backoffice.

### 9. Agentsky rezim - zadavani (query param target=agent, mozne spojeni s link=ABC).

1. - [x] 9.1) Pokud existuje query param "target", zachovat ho pri prechodu na shrnuti.
2. - [x] 9.2) Pokud target=agent, preskocit volani CRM z 3.1, pouze zalozit/aktualizovat LB.
3. - [x] 9.3) Pokud target=agent, na podpisove obrazovce nezobrazit Canvas pro podpis; generovani PDF s podpisem neprovadet, pouzit puvodni PDF bez podpisu; volat /api/termination s target=agent a jako attachment poslat base64 pdf bez podpisu. Po uspechu presmerovat operatora na result page dle pravidel z bodu 8.
4. - [x] 9.4) Uprava /api/termination: pokud target=agent, poslat email jako v 8.1 s prilohou (sender = properties.agent.email, recipient = klient), emailType=linkToClient, body.path="pfp/email/terminate/linkToClient", body.parameters.terminateLink="terminate.${website}?linkId=${linkId}", a CRM request with terminationState=sentToClient.

### 10. Upravy /api/termination - pridani securityHash do email requestu (vytvorit dle open api, EMAIL_SALT v ENV).

1. - [x] Pridat securityHash do email requestu dle open api.

### 11. Doresit chybove stavy a zobrazeni obecne error page s opakovatelou akci.

1. - [x] Ziskani pojistoven z BE pri mountu.
2. - [x] Chyba pri ukladani dat prvniho kroku - handling odpovedi jednoho API callu.
3. - [ ] Chyba pri zprocesovani finalniho odeslani - handling odpovedi jednoho API callu.

### 12. Logovani z klienta.

1. - [ ] Novy endpoint /api/log; do "version" importovat verzi z package.json.
2. - [ ] Pripravit hook useLogger (stahne appState, vrati memo s logInfo/logWarning/logError).
3. - [ ] Pouzit hook vsude kde dochazi k volani BE a pri chybach volat logError s labely: link-builder, crm-termination, crm-termination-email, pdf, signed-pdf, status-code-[ERROR HTTP STATUS]. Do logName predavat zkraceny popis + error message.
4. - [ ] /api/termination server-side logovat chyby do console.error() s formatem: [labels]: zkracena message + chyba z BE.

### 13. Prepinani vizualu dle website + spravne propadavani website vsude (linkbuilder, BE requesty, ...).

1. - [x] Prepinani vizualu dle website, propadat website vsude.

### 14. Doplnit GA pro pageviews.

1. - [ ] Doplnit GA pro pageviews.

---

### EXTRAS

1. - [x] Filelink PFP komponenta potřebuje parametr pro filename

Notes:

- Use the checkboxes to mark progress (change [ ] to [x] when an item is done).
- Subitems are indented for clarity

---

# Body z testování

- [x] při výběru pojišťovny bych ocenila, kdyby pojišťovny byly řazeny abecedně v seznamu
- [ ] Pokud vyplním FOP nebo PO nepropíše se mi do CRM na objket výpověď název společnosti do pole Insured Name
- [ ] PDF výpovědi
- - [x] negeneruje se tam IČO v případě FOP a PO
- - [x] PDF se neotvírá v nové kartě, ale stahuje se do souborů. Za mě asi lepší otevírání v novém okně
- - [x] v případě, že zadám důvod výpovědi Jiný, do PDF by se měla propsat jen hodnota pole, kterou klient vyplní
