'use client';

import { useState } from 'react';
import AgePicker from '@/components/AgePicker';
import AskScreen from '@/components/AskScreen';

type AppScreen = 'age-picker' | 'ask';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('age-picker');
  const [age, setAge] = useState<number>(10);
  // In-memory session token — resets on page refresh, never stored persistently.
  const [sessionToken] = useState<string>(() => crypto.randomUUID());

  function handleAgeSelected(selectedAge: number) {
    setAge(selectedAge);
    setScreen('ask');
  }

  if (screen === 'ask') {
    return <AskScreen age={age} sessionToken={sessionToken} onReset={() => setScreen('age-picker')} />;
  }

  return <AgePicker onAgeSelected={handleAgeSelected} />;
}
