import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from './api/store/authStore'

const queryClient = new QueryClient()

const App = () => {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter basename='/'>
				<AppRoutes />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;