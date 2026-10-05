# Priya Shah — Portfolio

A static site with no build step. All text, colours, fonts, images and projects live in `content/*.json`. You never need to edit HTML.

```
index.html  works.html  work.html?slug=…  about.html  archive.html  contact.html
content/site.json     ← brand, theme, nav, home sections, about, FAQs, footer, contact
content/works.json    ← projects + case-study blocks + filter categories
content/archive.json  ← gallery items (images / videos)
assets/media/         ← put images & videos here (logo.svg = navbar logo + favicon)
assets/fonts/         ← licensed font files (see below)
.pages.yml            ← visual editor config (Pages CMS)
```

## Preview locally
```bash
python3 -m http.server 8000     # then open http://localhost:8000
```
(Double-clicking the HTML files will not work, because the browser blocks loading the JSON files from disk.)

## Editing
- **Visual editor:** push to GitHub, sign in at https://app.pagescms.org, and open the repo. Every field becomes a form, and image uploads go to `assets/media`. Each save is a commit, so the host redeploys automatically.
- **By hand:** edit the JSON files. In headings and taglines, `**bold**`, `*italic*` and `_italic_` are supported.
- **Placeholders:** any empty `image` / `cover` / `src` shows a gradient placeholder. Fill in a path such as `assets/media/syndicate.jpg` to replace it.
- **Hover videos:** set `coverVideo` on a project (`.mp4`, muted, short loop). It plays when the user hovers over the cover.
- **Hero layout:** `home.hero.variant` = `"split"` (stacked name) or `"centered"` (one line).
- **Works section background:** `home.works.gradient` (list of hex colours), or set `backgroundImage`.
- **Colours / radius / fonts:** the `theme` block in `site.json`.

## Fonts
Aglio Picasso and Neue Montreal are licensed fonts, so they are not included. Until you add them, the fallbacks are Instrument Serif and Inter Tight (Google Fonts).
To use the real fonts, add these files to `assets/fonts/`: `AglioPicasso.woff2`, `NeueMontreal-Regular.woff2`, `NeueMontreal-Medium.woff2`, `NeueMontreal-Italic.woff2`. Then set `"localFonts": true` in `site.json → theme`.

## Contact form → email
The form posts to [FormSubmit](https://formsubmit.co) at `contact.formEndpoint`. No account is needed.
**One-time step:** after deployment, send one test message. FormSubmit then emails priya1902shah@gmail.com an activation link. Click it, and every later message arrives in that inbox.
To use Formspree or Web3Forms instead, change `formEndpoint`.

## Deploy
Static hosting works with any provider: Netlify, Cloudflare Pages, Vercel or GitHub Pages. Connect the repo, leave the build command empty, and set the output directory to `/`. Add the custom domain in the host's dashboard.
