import React, { useContext, useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { Router, Switch, Route, BrowserRouter } from 'react-router-dom'
import AppContext from './contexts/AppContext'
import history from 'history.js'
import mainRoutes from './RootRoutes'
import { Store } from './redux/Store'
import { GlobalCss, MatxSuspense, MatxTheme, MatxLayout } from 'app/components'
import sessionRoutes from './views/sessions/SessionRoutes'
import { AuthContext } from './auth/AuthGuard'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import JwtLogin from './views/sessions/login/JwtLogin'

const App = () => {
  // const { routes, vendorRootRoutes } = mainRoutes;
  const [routes, setRoutes] = useState(mainRoutes.routes);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const { currentUser } = useContext(AuthContext);
  
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [currentUser])

  useEffect(() => {
    setRoutes(user?.role !== 'vendor' ? mainRoutes.routes : mainRoutes.vendorRootRoutes);
  }, [user])

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
                          />)
                        )}
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
