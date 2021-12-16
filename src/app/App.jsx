import React, { useContext } from 'react'
import { Provider } from 'react-redux'
import { Router, Switch, Route, BrowserRouter } from 'react-router-dom'
import AppContext from './contexts/AppContext'
import history from 'history.js'
import routes from './RootRoutes'
import { Store } from './redux/Store'
import { GlobalCss, MatxSuspense, MatxTheme, MatxLayout } from 'app/components'
import sessionRoutes from './views/sessions/SessionRoutes'
import { AuthContext } from './auth/AuthGuard'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import JwtLogin from './views/sessions/login/JwtLogin'

const App = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <AppContext.Provider value={{ routes }}>
      <Provider store={Store}>
        <SettingsProvider>
          <MatxTheme>
            <GlobalCss />
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <Router history={history}>
                {currentUser ?
                  <MatxSuspense>
                    <Switch>
                      {/* AUTHENTICATION PAGES (SIGNIN, SIGNUP ETC.) */}
                      {sessionRoutes.map((item, i) => (
                        <Route
                          key={i}
                          path={item.path}
                          component={item.component}
                        />
                      ))}
                      {/* AUTH PROTECTED DASHBOARD PAGES */}
                      <MatxLayout>
                        {routes.map((item, i) => (
                          <Route
                            key={i}
                            path={item.path}
                            component={item.component}
                          />
                        ))}
                      </MatxLayout>
                    </Switch>
                  </MatxSuspense>
                  :
                  <JwtLogin />
                }
              </Router>
            </BrowserRouter>
          </MatxTheme>
        </SettingsProvider>
      </Provider>
    </AppContext.Provider>
  )
}

export default App
