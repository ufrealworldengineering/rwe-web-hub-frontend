import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUIStore } from './store/uiStore' 
import { useEffect } from 'react'

const queryClient = new QueryClient()

const App = () => {

const { theme } = useUIStore(); // Get the current theme (light or dark)

  
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