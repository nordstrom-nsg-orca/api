// import React from 'react';
// import Header from './components/header/header.js';
// import ACLList from './components/ACL-list/acl-list.js';

// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <Header></Header>
//       <ACLList></ACLList>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import Header from './components/Header/header';
import ACLList from './components/ACL-list/acl-list';
// import { useDarkMode } from './components/DarkMode';

import './App.css';

function App() {

  return (
      <div>
        <Header></Header>
        <ACLList></ACLList>
      </div>
  );
}

export default App;


