import React from "react";
import { create } from "zustand";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";

// Zustand Store
const useCalculatorStore = create((set) => ({
  input: "",
  buttons: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "*", "C", "0", "=", "/"],
  updateInput: (value) => set((state) => ({ input: state.input + value })),
  clearInput: () => set({ input: "" }),
  swapButtons: (dragIndex, hoverIndex) =>
    set((state) => {
      const newButtons = [...state.buttons];
      [newButtons[dragIndex], newButtons[hoverIndex]] = [newButtons[hoverIndex], newButtons[dragIndex]];
      return { buttons: newButtons };
    }),
  calculateResult: () =>
    set((state) => {
      try {
        if (state.input.trim() === "") return { input: "" };
        const result = Function(`"use strict"; return (${state.input})`)(); // Safe evaluation
        return { input: result.toString() };
      } catch (error) {
        return { input: "Error" };
      }
    }),
}));

// Drag-and-Drop Button Component
const DraggableButton = ({ value, index }) => {
  const { updateInput, swapButtons, calculateResult, clearInput } = useCalculatorStore();

  const [{ isDragging }, drag] = useDrag({
    type: "BUTTON",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "BUTTON",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        swapButtons(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleClick = () => {
    if (value === "=") calculateResult();
    else if (value === "C") clearInput();
    else updateInput(value);
  };

  return (
    <button
      ref={(node) => drag(drop(node))}
      onClick={handleClick}
      className={`bg-blue-500 text-white p-4 rounded-md hover:bg-blue-700 transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {value}
    </button>
  );
};

// Main App Component
export default function App() {
  const { input, buttons } = useCalculatorStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Draggable Calculator</h1>
        <div className="bg-white shadow-md p-6 rounded-md">
          <input
            type="text"
            value={input}
            readOnly
            className="w-full mb-2 p-2 border border-gray-300 rounded text-right"
          />
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((char, index) => (
              <DraggableButton key={index} value={char} index={index} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
