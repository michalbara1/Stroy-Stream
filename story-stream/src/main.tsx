import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import './index.css';
import 'react-quill/dist/quill.snow.css'; 

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement!);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
