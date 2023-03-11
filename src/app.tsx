import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@fontsource/ibm-plex-sans";
import Home from './Home';

function render() {
  ReactDOM.render(<Home />, document.getElementById('root'));
}

render();