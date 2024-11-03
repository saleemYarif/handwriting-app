import { DrawingCanvas } from '@/components/DrawingCanvas';
import { Toolbar } from '@/components/Toolbar';
import { ConvertedText } from '@/components/ConvertedText';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-6 px-4 space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Sketch & Convert</h1>
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">Beta</span>
            </div>
          </header>
          <Toolbar />
          <div className="grid lg:grid-cols-2 gap-6">
            <DrawingCanvas />
            <ConvertedText />
          </div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;