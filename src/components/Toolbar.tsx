import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDrawingStore } from '@/stores/drawing-store';
import { toast } from 'sonner';
import {
  Eraser,
  Pen,
  RotateCcw,
  Download,
  ZoomIn,
  ZoomOut,
  Trash2,
  Move,
  Square,
  Circle,
  Grid,
} from 'lucide-react';

export function Toolbar() {
  const {
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    penStyle,
    setPenStyle,
    zoom,
    setZoom,
    clearCanvas,
    undo,
    historyIndex,
  } = useDrawingStore();

  const handleClear = () => {
    if (window.confirm('Clear everything? This cannot be undone.')) {
      clearCanvas();
      toast.success('Canvas cleared');
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tools">Drawing Tools</TabsTrigger>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={penStyle} onValueChange={setPenStyle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pen Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ballpoint">Ballpoint Pen</SelectItem>
                <SelectItem value="fountain">Fountain Pen</SelectItem>
                <SelectItem value="pencil">Pencil</SelectItem>
                <SelectItem value="marker">Marker</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={tool === 'pen' ? 'default' : 'outline'}
                onClick={() => setTool('pen')}
                size="icon"
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                onClick={() => setTool('eraser')}
                size="icon"
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'pan' ? 'default' : 'outline'}
                onClick={() => setTool('pan')}
                size="icon"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'rectangle' ? 'default' : 'outline'}
                onClick={() => setTool('rectangle')}
                size="icon"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === 'circle' ? 'default' : 'outline'}
                onClick={() => setTool('circle')}
                size="icon"
              >
                <Circle className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <div className="w-32">
                <Slider
                  value={[brushSize]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={([value]) => setBrushSize(value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="canvas">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="py-2 px-3 bg-muted rounded text-sm">
                {(zoom * 100).toFixed(0)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline">
              <Grid className="h-4 w-4 mr-2" />
              Toggle Grid
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-3 gap-4">
            {['Blank', 'Ruled', 'Grid', 'Dotted', 'Cornell', 'Music'].map((template) => (
              <Card
                key={template}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => toast.success(`${template} template selected`)}
              >
                <div className="aspect-[1/1.414] bg-muted rounded mb-2" />
                <p className="text-sm font-medium text-center">{template}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}