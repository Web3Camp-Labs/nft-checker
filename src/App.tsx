import React  from 'react';
import GlobalStyle from "./utils/GloablStyle";
import { HashRouter  } from "react-router-dom";
import RouterLink from "./router/router";

function App() {



  return (
      <div>
          <HashRouter>
              <RouterLink />
          </HashRouter>

        <GlobalStyle />
      </div>
  );
}

export default App;
