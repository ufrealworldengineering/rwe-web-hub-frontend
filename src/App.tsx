import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from './api/store/authStore'
import { useUIStore } from './store/uiStore'

const queryClient = new QueryClient()

const App = () => {
	const checkAuth = useAuthStore((state) => state.checkAuth);
	const { theme } = useUIStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		const root = window.document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [theme]);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter basename='/'>
				<AppRoutes />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
