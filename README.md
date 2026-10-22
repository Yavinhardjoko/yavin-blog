# Yavin Blog — Static Website Starter

A minimalist, responsive personal website + blog for `yavin.blog`. It is plain HTML/CSS/JS, so it can be deployed directly with Cloudflare Pages and does not need a build command, paid hosting, database, or a server running on your PC.

## Files

- `index.html` — homepage, profile card, latest articles, interests, social links
- `about.html` — about page
- `articles/index.html` — article listing
- `articles/*.html` — individual article pages
- `assets/css/style.css` — all styles and responsive layout
- `assets/js/main.js` — current year, animations, and Discord presence
- `assets/images/avatar-placeholder.svg` — placeholder image; replace with your own photo

## Deploy safely without disconnecting the domain

1. Open the GitHub repository `Yavinhardjoko/yavin-blog`.
2. Download/backup the existing `index.html` first if you want to keep the previous version.
3. Upload the contents of this folder to the **root** of the repository (not the ZIP file itself). Keep the same repository and branch currently connected to Cloudflare Pages.
4. Commit the changes. Cloudflare Pages should automatically deploy the new version.
5. Do **not** change nameservers or delete your Cloudflare Pages project/domain configuration. This update changes website files only.

Cloudflare Pages settings for this no-build static site should use the repository's current production branch, no framework preset, and no build command. The output directory should be `/` if the Pages project expects the repository root. If your existing Pages project uses different settings and is already deploying correctly, leave them unchanged.

## Personalize your links

In `index.html`, find the `#contact` section and replace:
- `YOUR_EMAIL@example.com` with your public email address
- Discord User ID in the `data-user-id` attribute and profile URL in `index.html`
- `https://instagram.com/` with your Instagram profile URL
- `https://x.com/` with your X profile URL

Update the same social links in `about.html` only if you add social links there later. Never put passwords, private tokens, or API keys into public files.

## Update your photo

The current profile photo is `assets/images/yavin-profile.png` and appears on the homepage and About page. Replace this file to update both profile images. Use a photo you have permission to publish and update the image alt text in `index.html` and `about.html` if needed.

## Add a new article

The easiest method is to duplicate an existing file such as `articles/current-favorites.html`:
1. Copy it as `articles/my-new-post.html`.
2. Edit its `<title>`, description, heading, date/category text, and body.
3. Add a new article card in `index.html` and `articles/index.html` linking to `articles/my-new-post.html`.
4. Commit the changes. Cloudflare Pages will deploy automatically.

Article content is HTML, not Markdown, so it works without a build system. You can write regular paragraphs with `<p>`, headings with `<h2>`, lists with `<ul><li>...</li></ul>`, and links with `<a href="...">...</a>`.

## Notes

- This starter uses Google Fonts via an external stylesheet. If the fonts cannot load, it falls back to system sans-serif/serif fonts.
- The social links are placeholders until you replace them.
- The homepage Discord profile card reads public presence from Lanyard and refreshes every 30 seconds. The account must join the Lanyard Discord server for its live presence to be available. The animated banner is the Tenor clip shared by the site owner, served as a small looping MP4 with a PNG poster for faster loading. The magenta border and avatar decoration are visual styling, not synchronized Discord Nitro effects. Replace `assets/images/discord-banner.mp4` and `assets/images/discord-banner-poster.png` to customize the banner. The user ID is public; never expose a Discord bot token or other secret in browser-side JavaScript.


## Interactive effects included

- Scroll reveal animations as sections enter the screen.
- A light/night mode toggle in the header, with the selected theme saved in the browser.
- A CSS 3D green orb on the homepage, with gentle floating motion and orbit rings.
- Pointer-controlled 3D tilt on the profile card and article artwork (desktop/laptop).
- A slim scroll-progress indicator in the header.
- A short transition when opening another page on this site.
- Respects the device's “Reduce motion” accessibility setting.

These effects use plain CSS and JavaScript; no build step, framework, or API key is required. The 3D orb is CSS-based (not a heavy WebGL scene), so the site stays lightweight for Cloudflare Pages.


## Water transition revision

Internal page links trigger a green water-like wipe rising from the bottom. The current page sinks and the headings/letters fade backward before the next page opens. The profile card is excluded from the scroll-reveal transform so it stays visible and avoids transform conflicts. Reduced-motion settings disable the effects.
