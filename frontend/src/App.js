
import './App.css';
import {Route,Routes} from 'react-router-dom'

import ChatComponent from './components/ChatComponent';
import Register from './components/Register';
import Logout from './components/Logout';
import StoryFilter from './components/StoryFilter';
import StoryPoemList from './components/StoryPoemList';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Register></Register>}></Route>
        <Route path='/chat' element={<ChatComponent></ChatComponent>}></Route>
        <Route path='/logout' element={<Logout></Logout>}></Route>
        <Route path='/story-filter' element={<StoryFilter></StoryFilter>}></Route>
        <Route path='/stories' element={<StoryPoemList></StoryPoemList>}></Route>
      </Routes>
    </div>
  );
}

export default App;
