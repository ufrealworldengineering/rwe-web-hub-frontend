import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'

const App = () => {
	return (
		<BrowserRouter basename='/rwe-web-hub-frontend'>
			<AppRoutes />
		</BrowserRouter>
	);
}

export default App;