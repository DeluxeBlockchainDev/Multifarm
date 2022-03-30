import React, { useState } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { Footer } from './components/Footer'
import Header from './components/Header'
import routes from './routes'
import { AppWrapper, BodyWrapper } from './styled'
import { theme } from './theme'

export default function App() {
  const [darkMode, toggleDarkMode] = useState(true)

  const handleModeSwitch = () => {
    toggleDarkMode(true)
  }

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <BrowserRouter>
        <AppWrapper className="AppWrapper">
          <div>
            <Header darkMode={darkMode} handleModeSwitch={handleModeSwitch} />

            <BodyWrapper>
              <Switch>
                {routes.map((route, index) => (
                  <Route path={route.path} exact key={index}>
                    <route.Component />
                  </Route>
                ))}
                <Route path="/">
                  <Redirect to="/farms" />
                </Route>
              </Switch>
            </BodyWrapper>
          </div>
          <Footer />
        </AppWrapper>
      </BrowserRouter>
    </ThemeProvider>
  )
}
