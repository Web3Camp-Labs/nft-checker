import React  from 'react';
import GlobalStyle from "./utils/GloablStyle";
import { BrowserRouter  } from "react-router-dom";
import RouterLink from "./router/router";

function App() {



  return (
      <div>
          <BrowserRouter>
              <RouterLink />
          </BrowserRouter>

        <GlobalStyle />
      </div>
  );
}

export default App;
