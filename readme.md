# Engros

We redesigned the internet for Gen Z 💀💀💀

How to use this? Go to https://engros.vercel.app, paste a link to any online article, and get a **COLORFUL FLIPBOOK**. For example, here’s an article about monads in Haskell: https://engros.vercel.app/en.wikibooks.org/wiki/Haskell/Understanding_monads

Yes, _it’s totally cursed._

If you install this reader as an app (PWA), you can open any link in it via the Share menu. Links within the text also open in the reader, so by our devious design, you’ll end up trapped in a vicious cycle!

To take over the world and zombify young minds with this unique article format, we turned it into a JavaScript library. So, if you’re an educator who’s embraced the world of infinite and effortless dopamine, you can generate slides from educational materials with just a few lines of code.

🤯🤯🤯🤯🤯🤯

https://github.com/user-attachments/assets/cd9e7b13-80e7-418c-ae96-ec0ae256869e

## How it works

No LLMs (for now). All we use is a set of predefined layouts and a bit randomized backgrounds. The algorithm splits the given article into slides so there is not much text on each of them.

By the way, we extract the basic structure from web articles using Mozilla’s Readability.js: the same library that is used in Firefox Reader view.

<details>

<summary>Our thought process (also cursed)</summary>

![telegram-cloud-photo-size-2-5208847444106931342-y](https://github.com/user-attachments/assets/2855f943-fb91-46cf-9197-1b7fb3665968)

</details>

## Engros Library

The library is not stable and the API will change. It only works in browser for now, but we will hopefully fix this.

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

1. Generate the content:

    ```javascript
    import engros from 'engros';
    
    let content = engros(originalHTML, url);
    document.body.replaceChildren(content);
    ```

2. Include `engros/style.css`.
