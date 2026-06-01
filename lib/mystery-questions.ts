const QUESTIONS: Record<'young' | 'middle' | 'older', string[]> = {
  // Ages 6–8: wonder, magic, everyday mysteries
  young: [
    'Why is the sky blue?',
    'How do fish breathe underwater?',
    'Why do we dream?',
    'How does a caterpillar turn into a butterfly?',
    'Why does the moon change shape?',
    'Why do leaves change color in autumn?',
    'How do birds know where to fly in winter?',
    'What makes a rainbow appear?',
    'Why does popcorn pop?',
    'Where do stars go during the day?',
    'Why is fire hot?',
    'How do bees make honey?',
    'Why do dogs wag their tails?',
    'How do plants eat?',
    'Why does ice melt when you hold it?',
  ],

  // Ages 9–11: science, nature, exploration
  middle: [
    'How do black holes work?',
    'Why don\'t spiders get stuck in their own webs?',
    'What would happen if the Earth had no moon?',
    'How do volcanoes erupt?',
    'Why do we have different blood types?',
    'What is the deepest part of the ocean?',
    'How do planes stay in the air?',
    'Why do we have fingerprints?',
    'What would happen if the Earth stopped spinning?',
    'How does lightning form?',
    'What is the largest living thing on Earth?',
    'How do magnets work?',
    'Why do we laugh?',
    'How do computers process information?',
    'Why do some animals glow in the dark?',
  ],

  // Ages 12–15: deep science, philosophy, the big questions
  older: [
    'What happens at the edge of the universe?',
    'Could we ever live on Mars?',
    'How does the brain store memories?',
    'What is quantum entanglement?',
    'Why do humans age, and could we ever stop it?',
    'How did life first appear on Earth?',
    'What is dark matter?',
    'Could artificial intelligence ever become conscious?',
    'How does DNA contain all the instructions for building a human?',
    'What is the Fermi Paradox and why is it puzzling?',
    'How do neurons create thoughts and feelings?',
    'What would happen if matter met antimatter?',
    'Why does time pass faster or slower depending on gravity?',
    'How do viruses evolve to infect new species?',
    'What would a world without mathematics look like?',
  ],
};

export function pickMysteryQuestion(age: number): string {
  const bucket = age <= 8 ? 'young' : age <= 11 ? 'middle' : 'older';
  const qs = QUESTIONS[bucket];
  return qs[Math.floor(Math.random() * qs.length)];
}
