import AppRouter from './Routes/AppRouter';
import { ApiDebugger } from './lib/api-debug';
import { ApiStatus } from './lib/api-status';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouter />
      {import.meta.env.DEV && <ApiDebugger />}
      {import.meta.env.DEV && <ApiStatus />}
    </div>
  );
}

export default App
