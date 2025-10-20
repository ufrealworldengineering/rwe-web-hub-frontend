import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'

const App = () => {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}

export default App;