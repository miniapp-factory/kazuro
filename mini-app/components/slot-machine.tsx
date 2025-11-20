"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  // Initialize grid on mount
  useEffect(() => {
    setGrid([
      [randomFruit(), randomFruit(), randomFruit()],
      [randomFruit(), randomFruit(), randomFruit()],
      [randomFruit(), randomFruit(), randomFruit()],
    ]);
  }, []);

  // Check win condition whenever grid changes and not spinning
  useEffect(() => {
    if (spinning) return;
    // Check rows
    for (const row of grid) {
      if (row.every((f) => f === row[0])) {
        setWin(`You won with ${row[0]} row!`);
        return;
      }
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      const colValues = grid.map((r) => r[col]);
      if (colValues.every((f) => f === colValues[0])) {
        setWin(`You won with ${colValues[0]} column!`);
        return;
      }
    }
    setWin(null);
  }, [grid, spinning]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newTop = [randomFruit(), randomFruit(), randomFruit()];
        return [newTop, prev[0], prev[1]];
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div
            key={idx}
            className="w-20 h-20 flex items-center justify-center border rounded-md bg-white"
          >
            <img
              src={`/${fruit}.png`}
              alt={fruit}
              className="w-16 h-16 object-contain"
            />
          </div>
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-green-600 font-semibold">
          {win}
          <div className="mt-2">
            <Share text={`I just ${win} in the Fruit Slot Machine! ${url}`} />
          </div>
        </div>
      )}
    </div>
  );
}
