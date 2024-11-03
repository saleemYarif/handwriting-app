import { create } from 'zustand';

interface DrawingState {
  tool: 'pen' | 'eraser' | 'pan' | 'rectangle' | 'circle';
  color: string;
  brushSize: number;
  penStyle: 'ballpoint' | 'fountain' | 'pencil' | 'marker';
  zoom: number;
  panOffset: { x: number; y: number };
  history: string[];
  historyIndex: number;
  convertedText: string;
  currentStroke: { x: number; y: number }[];
  
  setTool: (tool: DrawingState['tool']) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setPenStyle: (style: DrawingState['penStyle']) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  addToHistory: (dataUrl: string) => void;
  undo: () => void;
  clearCanvas: () => void;
  setStroke: (stroke: { x: number; y: number }[]) => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  tool: 'pen',
  color: '#000000',
  brushSize: 2,
  penStyle: 'ballpoint',
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  convertedText: '',
  currentStroke: [],
  
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setPenStyle: (style) => set({ penStyle: style }),
  setZoom: (zoom) => set({ zoom }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  
  addToHistory: (dataUrl) => set((state) => {
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), dataUrl];
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),
  
  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    return { historyIndex: state.historyIndex - 1 };
  }),
  
  clearCanvas: () => set({
    history: [],
    historyIndex: -1,
    convertedText: '',
    currentStroke: [],
  }),
  
  setStroke: (stroke) => {
    set((state) => ({
      convertedText: state.convertedText + 'Sample recognized text\n',
      currentStroke: stroke,
    }));
  },
}));