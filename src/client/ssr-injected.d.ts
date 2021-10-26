import { Pokemon } from "../pokemon/mod.ts";

declare global {
    interface Window {
        initialPokes: Pokemon[];
    }
}