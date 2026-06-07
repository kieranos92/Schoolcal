# SchoolCal — Setup Guide (v0.1)

Everything here can be done from your **Android phone's browser**. You only fill in
forms and copy/paste a few keys. Total time: ~30–40 minutes.

You'll set up 4 free things:
1. **Firebase** — login + database (free "Spark" plan, no card needed)
2. **EmailJS** — sends the invite emails (free tier) — *optional, can add later*
3. **GitHub** — stores your app files
4. **Netlify** — puts the app online with HTTPS + gives you test/preview links

---

## PART 1 — Firebase (login + database)

### 1A. Create the project
1. Go to **console.firebase.google.com** and sign in with your Google account.
2. Tap **Create a project** (or "Add project").
3. Project name: `schoolcal` → **Continue**.
4. Google Analytics: toggle **OFF** (you don't need it) → **Create project**.
5. Wait for it to finish → **Continue**.

### 1B. Register the web app + get your keys
1. On the project home, tap the **`</>`** (web) icon — "Add an app".
2. App nickname: `SchoolCal` → **do NOT** tick Firebase Hosting → **Register app**.
3. You'll see a code block with `const firebaseConfig = { ... }`.
   **Copy the values** inside the `{ }` — apiKey, authDomain, projectId, etc.
4. Paste them into the `CONFIG.firebase` section at the top of **index.html**.

### 1C. Turn on Email/Password login
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Email/Password** → toggle **Enable** → **Save**.

### 1D. Create the database
1. Left menu → **Build → Firestore Database → Create database**.
2. Choose a location near you → **Next**.
3. Start in **Production mode** → **Create**. (We'll paste secure rules next.)

### 1E. Paste the security rules (THIS is your web security)
1. In Firestore → **Rules** tab.
2. Delete everything there and paste the entire contents of **firestore.rules**.
3. ⚠️ Find the line `myEmail() == 'you@example.com'` and change it to **your**
   email — the one you'll use as the head admin.
4. Tap **Publish**.

### 1F. Set your admin email in the app
- In **index.html**, set `CONFIG.bootstrapAdminEmail` to the **same** email you
  just used in the rules. Whoever signs up with this email becomes the first Admin.

✅ Firebase done.

---

## PART 2 — EmailJS (invite emails)  *(optional — skip to test faster)*

If you skip this, invites still work: the app copies a sign-up link for you to
send by text/WhatsApp. Add EmailJS whenever you want automatic emails.

1. Go to **emailjs.com** → sign up free.
2. **Email Services** → **Add New Service** → pick **Gmail** (or your provider) →
   connect your email → note the **Service ID**.
3. **Email Templates** → **Create New Template**. Set:
   - **To Email:** `{{to_email}}`
   - **Subject:** `You're invited to SchoolCal`
   - **Content:** paste the body from **emailjs-template.txt**
   - **Save** → note the **Template ID**.
4. **Account → General → Public Key** → copy it.
5. Paste all three (publicKey, serviceId, templateId) into `CONFIG.emailjs` in index.html.
6. In EmailJS **Account → Security**, add your Netlify site address to the allowed
   origins list once you have it (Part 4). This stops others using your key.

---

## PART 3 — GitHub (store the files)

1. Go to **github.com** → sign up / sign in.
2. Tap **+ → New repository**. Name: `schoolcal`. Keep it **Public** (or Private —
   both work with Netlify). **Create repository**.
3. On the repo page tap **uploading an existing file** (or **Add file → Upload files**).
4. Upload **all** of these from the schoolcal folder:
   `index.html`, `manifest.json`, `sw.js`, and the whole `icons` folder
   (upload the icon PNGs — keep them inside a folder named `icons`).
   *(firestore.rules and the .md/.txt files are just for you — you don't need to upload them.)*
5. Tap **Commit changes**.

---

## PART 4 — Netlify (go online + test links)

1. Go to **netlify.com** → **Sign up** → choose **GitHub** to log in.
2. **Add new site → Import an existing project → GitHub** → authorise → pick your
   `schoolcal` repo.
3. Build settings: leave **everything blank** (it's a plain static site) → **Deploy**.
4. After ~30 seconds you get a live URL like `https://schoolcal-xyz.netlify.app`.

### Testing before "going live"
- That Netlify URL is yours only until you share it. **Test it first**:
  open it, sign up with your admin email, add events, invite a test address.
- For ongoing changes: edit files on a **branch** in GitHub (not `main`). Netlify
  auto-builds a separate **preview URL** for each branch/pull request, so you can
  check changes safely. Merging the branch into `main` is what updates the real site.
- When you're happy, share the main URL with parents and tell them to **Add to
  Home Screen** (Chrome menu on Android; Safari Share menu on iPhone).

---

## What works in v0.1
- ✅ Secure login, 3 roles (admin / teacher / parent)
- ✅ Admin-only invites by email + role; only admins can change roles
- ✅ Shared calendar; teachers/admins add events, everyone sees them, parents filter by class
- ✅ Notifications + class subscriptions **while the app is open / in the background tab**
- ✅ Installable PWA on Android & iPhone

## Planned for v0.2 (needs a computer + Firebase "Blaze" plan, still ~free at low use)
- 🔜 True push notifications when the app is fully closed (sent by a small Cloud Function)
- 🔜 Scheduled reminders ("evening before", "morning of")
- 🔜 Export to Google/Apple Calendar

## Security notes
- The Firebase keys in index.html are **meant** to be public — they only identify
  your project. Your real protection is the **Firestore rules** (Part 1E), which the
  server enforces and no one can bypass from the browser.
- Keep the bootstrap-admin email private-ish; anyone who signs up with that exact
  address becomes admin. After your first login you can remove/replace that line.
- Turn on 2-factor auth for your Google, GitHub, Netlify and EmailJS accounts.
