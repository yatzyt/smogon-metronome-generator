/// <reference path="./clipboard-api.d.ts"/>

import { React, tw } from "../../frontend_deps.ts";
import { Pokemon, randomizePokemon } from "../pokemon/mod.ts";
import PokemonDisplay from "./pokemon.tsx";
import Button from "./button.tsx";

const { useState, useCallback } = React;

interface AppProps {
    pkmn: Pokemon[];
    regenerate: () => void;
}

function textualizeTeam(pkmn: Pokemon[]): string {
    const textualizedPokes = [];
    for (const poke of pkmn) {
        textualizedPokes.push(`${poke.species.name} @ ${poke.heldItem}`);
        textualizedPokes.push(`Ability: ${poke.ability.name}`);
        textualizedPokes.push(`- Metronome`);
        textualizedPokes.push("");
    }
    return textualizedPokes.join('\n');
}

function getClipboard() {
    if (typeof navigator === 'undefined') {
        return null;
    }
    if (navigator && navigator.clipboard) {
        return navigator.clipboard;
    } else {
        return null;
    }
}

const StatelessApp = ({ pkmn, regenerate }: AppProps) => {
    const canUseClipboard = getClipboard() != null;
    const copyTeam = useCallback(() => {
        const clipboard = getClipboard();
        if (clipboard) {
            clipboard.writeText(textualizeTeam(pkmn));
        }
    }, [pkmn]);
    return (
        <div className={tw`h-screen bg-green-800`}>
            <div className={tw`container h-screen mx-auto px-4 py-4 grid grid-rows-fixed-header grid-cols-2 bg-indigo-50`}>
                <h1 className={tw`text-3xl font-sans`}>
                    Smogon Metronome Battle Generator
                </h1>
                <div className={tw`flex flex-row justify-end items-center`}>
                    <Button onClick={() => regenerate()}>
                        <span>Create another team!</span>
                    </Button>
                    <span className={tw`text-sm italic px-1`}>
                        Written by Nathan Moos.
                    </span>
                    <a className={tw`text-blue-500`}
                        href="https://github.com/moosingin3space/smogon-metronome-generator">
                            <i className="fab fa-github"></i>
                            {` `}
                            GitHub
                    </a>
                </div>
                <PokemonDisplay {...pkmn[0]}/>
                <PokemonDisplay {...pkmn[1]}/>
                <div className={tw`flex flex-col justify-center items-center col-span-full`}>
                    <h2>Below is a textual representation of your team:</h2>
                    <textarea
                        readOnly={true}
                        rows={15}
                        cols={50}
                        className={tw`my-3`}
                        value={textualizeTeam(pkmn)}
                    />
                    {canUseClipboard ?
                        <Button onClick={() => copyTeam()}>
                            Copy to Clipboard
                        </Button>
                        :
                        <span className={tw`text-sm italic`}>
                            Your browser does not support the clipboard API.
                            You'll need to copy-paste the above text into Showdown manually.
                        </span>
                    }
                </div>
            </div>
        </div>
    );
};

interface MainAppProps {
    pkmn: Pokemon[];
}

const App = ({pkmn: initialPokes}: MainAppProps) => {
    const [pkmn, setPkmn] = useState(initialPokes);
    const regenerate = useCallback(() => {
        setPkmn([
            randomizePokemon(),
            randomizePokemon(),
        ]);
    }, [setPkmn]);
    return <StatelessApp pkmn={pkmn} regenerate={regenerate}/>;
};

export default App;