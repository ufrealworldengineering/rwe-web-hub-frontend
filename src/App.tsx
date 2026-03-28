import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter basename='/'>
				<AppRoutes />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;