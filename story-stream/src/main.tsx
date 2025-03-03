import ReactDOM from 'react-dom/client'; 
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import './index.css';
import 'react-quill/dist/quill.snow.css'; 
import {GoogleOAuthProvider} from '@react-oauth/google'

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement!);

const CLIENT_ID="957327463252-bmpb4kvn7kgqcuq5jn9ed8j9loc1n5q6.apps.googleusercontent.com"

root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Provider store={store}>
        <App />
    </Provider>
    </GoogleOAuthProvider>
);
