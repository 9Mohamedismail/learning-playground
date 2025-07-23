import { words } from "./words"

function getRandomIndex<T>(array: T[]): T {
    const randomIndex: number = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

export function getRandomWord(): string {
    return getRandomIndex(words);
}

export function getFarewellText(language: string): string {
    const options: string[] = [
        `Farewell, ${language}`,
        `Adios, ${language}`,
        `R.I.P., ${language}`,
        `We'll miss you, ${language}`,
        `Oh no, not ${language}!`,
        `${language} bites the dust`,
        `Gone but not forgotten, ${language}`,
        `The end of ${language} as we know it`,
        `Off into the sunset, ${language}`, 
        `${language}, it's been real`,
        `${language}, your watch has ended`,
        `${language} has left the building`
    ];

   return getRandomIndex(options);
}