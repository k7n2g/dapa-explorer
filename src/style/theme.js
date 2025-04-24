import { glob } from 'goober'
import hashIt from 'hash-it'

const query = {
  maxMobile: '@media only screen and (max-width: 424px)',
  minMobile: '@media only screen and (min-width: 424px)',
  maxDesktop: '@media only screen and (max-width: 768px)',
  minDesktop: '@media only screen and (min-width: 768px)',
  minLarge: '@media only screen and (min-width: 1440px)',
  maxLarge: '@media only screen and (max-width: 1440px)',
}

// Keep goober 2.1.10 or glob will replace CSS instead of append
// https://github.com/cristianbote/goober/issues/496

const dapa = (style) => {
  glob`
    [data-theme="dapa"] {
      ${style}
    }
  `
}

const light = (style) => {
  glob`
    [data-theme="light"] {
      ${style}
    }
  `
}

const dark = (style) => {
  glob`
    [data-theme="dark"] {
      ${style}
    }
  `
}

const apply = (values) => {
  const keys = Object.keys(values)
  const name = hashIt(values)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = values[key]
    glob(`
      [data-theme="${key}"] {
        --${name}:${value};
      }
    `)
  }

  return `var(--${name})`
}

export default { query, light, dark, dapa, apply }

light`
  --bg-color: #fafafa;
  --text-color: #1c1c1c;
  --border-color: var(--text-color);
  --muted-color: rgba(0, 0, 0, .6);
  --error-color: red;
  --success-color: green;
  --link-color: #1870cb;
  --link-hover-color: #3889ff;
  --warning-color: #dfde32;
  --content-bg-color: rgb(231 231 231 / 50%);
`

dark`
  --bg-color: #101010;
  --text-color: #f1f1f1;
  --border-color: var(--text-color);
  --muted-color: rgba(255, 255, 255, .6);
  --error-color: red;
  --success-color: green;
  --link-color: #1870cb;
  --link-hover-color: #3889ff;
  --warning-color: #dfde32;
  --content-bg-color: rgb(12 12 12 / 50%);
`

dapa`
  --bg-color: #121fd4;
  --text-color: #f1f1f1;
  --border-color: var(--text-color);
  --muted-color: rgb(255 255 255 / 50%);
  --error-color: red;
  --success-color: green;
  --link-color: #308566;
  --link-hover-color: #38b18c;
  --warning-color: #dfde32;
  --content-bg-color: rgb(14 30 32 / 70%);
`
