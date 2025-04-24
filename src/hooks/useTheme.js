import { createContext, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import useCookie from 'g45-react/hooks/useCookie'

const Context = createContext()

const validateTheme = (theme) => {
  if ([`dapa`, `dark`, `light`].indexOf(theme) !== -1) {
    return theme
  }

  return `dapa`
}

export const ThemeProvider = (props) => {
  const { children } = props

  const [cookieTheme, setTheme] = useCookie('theme')

  let theme = validateTheme(cookieTheme)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return <Context.Provider value={{ theme, setTheme }}>
    <Helmet bodyAttributes={{ 'data-theme': theme }} />
    {children}
  </Context.Provider>
}

export const useTheme = () => useContext(Context)
export default useTheme

