# Neev Rao — Portfolio

A responsive, static portfolio for GitHub Pages. Plain HTML, CSS, and JavaScript; no build step or package installation required.

## Preview locally

Start a local server from this folder (the navigation uses a JavaScript module):

```powershell
python -m http.server 4173 --directory . --bind 127.0.0.1
```

Visit http://127.0.0.1:4173. Stop the server with Ctrl+C.

## Publish with GitHub Pages

The GitHub username supplied in the résumé is `neev-rao`. For a user site, use a public repository named **`neev-rao.github.io`**. Its default website address will be **https://neev-rao.github.io/**.

1. Sign in at https://github.com and create a new **public** repository named `neev-rao.github.io`. If it already exists, use that repository and check its contents before changing it.
2. In the repository, select **Add file → Upload files**. Upload `index.html`, `styles.css`, `script.js`, `interactions.mjs`, `resume.html`, `Neev_Rao_Resume.pdf`, and `favicon.svg` from this folder. Commit the files to the `main` branch. These files must sit at the repository root, not inside another folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the **main** branch and **/(root)** folder, then click **Save**.
6. Wait for the Pages deployment to finish. GitHub notes that publishing can take up to 10 minutes. Open **https://neev-rao.github.io/**.

The `.nojekyll` file can also be committed to skip Jekyll processing. It is not required for these ordinary HTML, CSS, and JavaScript files. Do not upload `.preview/`; it contains local review material and is ignored by Git. The supplied source résumés are intentionally not copied into the website.

### If you prefer publishing from your computer

The GitHub CLI is installed, but its saved authentication needs to be refreshed. Run this in your terminal and complete the browser sign-in yourself:

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

Once signed in, the site can be connected to GitHub and pushed. Repository creation should reuse an existing `neev-rao.github.io` repository if present rather than overwrite it.

### Optional custom domain later

No domain purchase is required for the free GitHub Pages address. Once the site is live, `neevrao.com` can be connected through **Settings → Pages → Custom domain**, followed by the domain provider's DNS setup. No custom domain or DNS changes are included in this version.

## Edit your content

- **`index.html`**: About, education, experience, projects, technology lists, contact information, and page metadata.
- **`styles.css`**: Fonts, layouts, responsive styling, and dark/light color variables at the top of the file.
- **`script.js`**: Theme preference, mobile navigation, section navigation and current year.
- **`interactions.mjs`**: Active-section selection for navigation highlighting.
- **`resume.html`**: A public résumé, without the phone number, with a **Print / Save as PDF** button. Keep it in sync with the main page when updating your experience.
- **`favicon.svg`**: Browser tab icon.

The design uses a compact text column, larger high-contrast text, and plain project links. There are no decorative background graphics. The header links to `Neev_Rao_Resume.pdf`. All content remains readable without JavaScript. Fonts use Google Fonts with local sans-serif fallbacks. Email uses a mail link and needs no backend.

Run the navigation checks with `node --test tests/*.test.mjs`.

If the repository remains named `neevrao.github.io` under the `neev-rao` account, it is a project site at **https://neev-rao.github.io/neevrao.github.io/**. The relative links and module imports support that address as well as a user site or custom domain.

The two supplied PDFs describe different worker implementations for the distributed agent platform. The website uses the shared description (Go control plane, concurrent workers, PostgreSQL-backed scheduling) until that detail is confirmed. The CPU Emulator has no supplied repository link, so it has a technical description without a guessed link.

## Official setup references

- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
