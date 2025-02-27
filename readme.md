# 📢🚀 Scholar.Love 💀🔥

🔥 **WE JUST REINVENTED THE INTERNET FOR GEN Z** 🔥 (yes, fr fr, no cap 🤡💀💀💀)

📚 **Scholar.Love** 🫀 is like… THE ULTIMATE WEAPON 🗡️ for **reading stuff online** 🫡. Articles? ✅ Textbooks? ✅ **The entirety of human knowledge?** ✅ (well, almost).

💥 **HOW TO USE THIS WILD THING:** 💥

1️⃣ **Step 1:** GO TO 👉 [scholar.love](https://scholar.love)<br>
2️⃣ **Step 2:** Paste a link. Any link. (Well, text-based. Don’t try your Spotify Wrapped, chief.)<br>
3️⃣ **Step 3:** BOOM 💣 **A FULLY JUICED, DRIP-DRENCHED, RIZZMAXXED PAGE** appears. 📜✨

🕶️ **Example? Oh, we got you.** Wanna read about MONADS in HASKELL? (why tho???) Try this: [scholar.love/en.wikibooks.org/wiki/Haskell/Understanding_monads](https://scholar.love/en.wikibooks.org/wiki/Haskell/Understanding_monads) 🤯

📺 **LIVE FOOTAGE OF IT IN ACTION:**

https://github.com/user-attachments/assets/cd9e7b13-80e7-418c-ae96-ec0ae256869e

<br>

Sorry! Sorry. No more emojis.

## How to use it

- **In your browser.** Type [scholar.love/](https://scholar.love) in front of any article URL, and it will just open.

- **As an app.** If you install this reader as an app (PWA), you can open any link in it via the Share menu. Links within the text also open in the reader, so by our devious design, you’ll end up trapped in a vicious cycle.

- **As a library.** To take over the world and zombify young minds with this unique article format, we turned this into a JavaScript library. So, if you’re an educator who’s embraced the world of infinite and effortless dopamine, you can generate slides from educational materials with just a few lines of code.

## How it works

No LLMs; all we use is a set of predefined layouts and a bit randomized backgrounds. The algorithm splits the given article into slides with a little text on each. By the way, we extract the basic structure from web articles using Mozilla’s Readability.js: the same library that is used in Firefox Reader view.

<details>

<summary>Our thought process (as cursed as the result)</summary>

![telegram-cloud-photo-size-2-5208847444106931342-y](https://github.com/user-attachments/assets/2855f943-fb91-46cf-9197-1b7fb3665968)

</details>

## Engros Library

Everything page generation is in our JS library named Engros. It is not stable yet, and the API will change. The library only works in browser for now, but we will hopefully fix this.

#### Install

```shell
npm install engros
```

#### Usage

`engros(html: string, referenceLink: string, proxyLink: string | null = null): HTMLElement | null `

- `html`: an HTML to extract content from, may be unsanitized.
- `referenceLink`: a link to the original HTML source to resolve relative paths for images etc.
- `proxyLink`: if provided, used to resolve in-text relative links.

#### Example

1. Generate the content and place it in the body:

    ```javascript
    import engros from 'engros';
    
    let content = engros(originalHTML, url);
    document.body.replaceChildren(content);
    ```

2. Include `engros/style.css`.
