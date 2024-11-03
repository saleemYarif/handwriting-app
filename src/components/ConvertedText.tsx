import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDrawingStore } from '@/stores/drawing-store';
import { Copy, Download, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export function ConvertedText() {
  const { convertedText } = useDrawingStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(convertedText);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([convertedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'converted-text.txt';
    document.body.appendChild(element);
    element.click();
    element.remove();
    toast.success('File downloaded');
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Converted Text</h2>
          <Wand2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="h-[calc(75vh-4rem)] overflow-auto p-4 bg-muted/30 border rounded-lg">
        {convertedText ? (
          <pre className="whitespace-pre-wrap font-sans">{convertedText}</pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Start writing to see converted text appear here
          </div>
        )}
      </div>
    </Card>
  );
}