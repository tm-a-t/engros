# Engros

**Generative Layout for Educational Texts**


## Library

Engros library generates an engaging narrative given a text

### Install

```shell
npm install engros
```

### Usage

`engros(html: string, referenceLink: string, proxyLink: string | null = null): HTMLElement | null `

- `html`: an HTML to extract content from, may be unsanitized.
- `referenceLink`: a link to the original HTML source to resolve relative paths for images etc.
- `proxyLink`: if provided, used to resolve in-text relative links.

### Example

1. Build Engros narrative:

    ```javascript
    import engros from 'engros';
    
    let content = engros(originalHTML, url)
    ```

2. Include `engros/style.css`.

## Reader App

An app built with the library: https://engros.vercel.app.

Install the PWA to open links in the app from the Share menu.
