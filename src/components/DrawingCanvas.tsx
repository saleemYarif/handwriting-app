import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDrawingStore } from '@/stores/drawing-store';
import { toast } from 'sonner';

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const {
    tool,
    color,
    brushSize,
    penStyle,
    zoom,
    panOffset,
    setStroke,
    addToHistory,
    setPanOffset,
  } = useDrawingStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = 2480; // A4 at 300 DPI
    canvas.height = 3508;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
    setupContext(context);
    
    addToHistory(canvas.toDataURL());
  }, []);

  useEffect(() => {
    if (!contextRef.current) return;
    setupContext(contextRef.current);
  }, [color, brushSize, penStyle]);

  const setupContext = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (penStyle === 'fountain') {
      context.shadowBlur = 1;
      context.shadowColor = color;
    } else {
      context.shadowBlur = 0;
    }
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return {
      x: (clientX - rect.left - panOffset.x) * scaleX / zoom,
      y: (clientY - rect.top - panOffset.y) * scaleY / zoom
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getPoint(e);
    
    if (tool === 'pan') {
      setLastPoint(point);
      return;
    }

    if (!contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(point.x, point.y);
    setIsDrawing(true);
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing && tool !== 'pan') return;
    if (!contextRef.current) return;

    const point = getPoint(e);

    if (tool === 'pan') {
      const dx = point.x - lastPoint.x;
      const dy = point.y - lastPoint.y;
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
      setLastPoint(point);
      return;
    }

    if (tool === 'pen') {
      contextRef.current.lineTo(point.x, point.y);
      contextRef.current.stroke();
      setCurrentStroke(prev => [...prev, point]);
    } else if (tool === 'eraser') {
      contextRef.current.save();
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineTo(point.x, point.y);
      contextRef.current.stroke();
      contextRef.current.restore();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    if (!canvasRef.current || !contextRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    if (currentStroke.length > 5) {
      setStroke(currentStroke);
      addToHistory(canvasRef.current.toDataURL());
      
      if (tool === 'pen') {
        toast.success('Stroke captured', {
          description: 'Converting to text...',
        });
      }
    }
    
    setCurrentStroke([]);
  };

  return (
    <Card className="p-4">
      <div className="overflow-auto border rounded-lg bg-muted/30" style={{ height: '75vh' }}>
        <div 
          className={cn(
            "relative",
            tool === 'pan' && "cursor-move",
            tool === 'eraser' && "cursor-crosshair"
          )}
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: 'fit-content'
          }}
        >
          <canvas
            ref={canvasRef}
            className="bg-white touch-none"
            style={{ 
              transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </Card>
  );
}