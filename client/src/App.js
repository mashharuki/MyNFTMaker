import './App.css';
import NftUploader from './components/NftUploader/NftUploader';
import Footer from './components/Footer/Footer';

/**
 * Appコンポーネント
 */
function App() {

  return (
    <>
      <div className='App'>
        <NftUploader/>
      </div>
      <Footer/>
    </>
  );
}


export default App;