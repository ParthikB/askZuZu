'use client';

import { useState } from 'react';
import AgePicker from '@/components/AgePicker';
import AskScreen from '@/components/AskScreen';

type AppScreen = 'age-picker' | 'ask';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('age-picker');
  const [age, setAge] = useState<number>(10);

  function handleAgeSelected(selectedAge: number) {
    setAge(selectedAge);
    setScreen('ask');
  }

  function handleReset() {
    setScreen('age-picker');
  }

  if (screen === 'ask') {
    return <AskScreen age={age} onReset={handleReset} />;
  }

  return <AgePicker onAgeSelected={handleAgeSelected} />;
}
