# Ahsaan Aslam — Developer Portfolio

Personal portfolio website, live at **https://ahsaanaslam.github.io**

Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.
Edit a file, push, and GitHub Pages redeploys automatically within a minute or two.

## Project structure

```
index.html          The whole site (all sections)
css/style.css       All styling (design tokens at the top under :root)
js/main.js          Animations, navigation, project details, contact form
assets/favicon.svg  Browser tab icon
assets/projects/    Put approved project screenshots here (see its README)
assets/docs/        Put approved, sanitized PDF documentation here (see its README)
.nojekyll           Tells GitHub Pages to serve files as-is
```

## How to update the site

1. Edit the files locally (any text editor works).
2. Preview by opening `index.html` in your browser.
3. Publish:

```
git add .
git commit -m "Describe your change"
git push
```

## Things marked for you to fill in

Search `index.html` for **`EDIT ME`** to find them:

- **Email** — in the Contact section, replace the placeholder block with a real
  `mailto:` link once you decide which address to show publicly.
- **LinkedIn** — same section, add your profile URL when ready.
- **Profile photo** — in the Hero section, replace the monogram block with
  `<img src="assets/profile.jpg" alt="Portrait of Ahsaan Aslam">` after adding
  your photo to `assets/`.
- **Resume button** — intentionally not included yet; add one next to the hero
  buttons when you have a PDF resume in `assets/`.

## Contact form

GitHub Pages is static hosting — it cannot send email by itself. The form is
wired for [Formspree](https://formspree.io) (free tier available):

1. Create a Formspree account and a new form; it gives you an ID like `xabcdefg`.
2. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` attribute.
3. Push. The form will then deliver messages to your email.

Until then, the form politely tells visitors it isn't connected and points them
to GitHub — it never pretends to send.

## Screenshots & documentation

See `assets/projects/README.md` and `assets/docs/README.md`. Only publish
material your company has approved, with confidential data removed.
