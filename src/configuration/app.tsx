import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "@fontsource/ibm-plex-sans";
import { Configuration } from '@/configuration/configuration';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Configuration />);