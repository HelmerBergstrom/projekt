# Projekt för kursen DT211G - Frontend-baserad webbutveckling.
#### Av Helmer Bergström

## Syfte
Syftet med projektet är att skapa en app-liknande webbplats som hämtar och visar data om filmer och serier. Detta med hjälp av två API:er/webbtjänster vid namn OMDB API och Wikipedia API.
Webbplatsen ska ladda data om filmer och serier dynamiskt, och ge användaren det den vill ha beroende på handlingar som görs på webbplatsen. All kod är skapad utav mig, med undantag från data som hämtats från API:erna.

## Tekniker
I projektet används:
- HTML
- SCSS
- JavaScript
- API:er
- Fetch API
- JSON
- NPM paketet Parcel
- jsdoc för kommentarer till JavaScript
- @parcel/transformer-sass för översättning till CSS

Projektet kan köras lokalt genom kommandon: "npm install" och "npm run dev".
Projektet byggs genom att köra kommandot: "npm run build", dvs. om parcel används.

## Övriga kommentarer
Jag har använt Parcel som ett utvecklingverktyg i skapandet av webbplatsen. All kod som är skapad utav mig finns i src-katalogen. SCSS-koden är uppdelat i komponenter i src-katalogen. 

Parcel har använts i publiceringsprocessen för att optimera filerna. De optimerade filerna läggs i "dist"-katalogen som sedan körs vid publiceringen. 
