import { React, tw } from "../../frontend_deps.ts";
import { Pokemon } from "../pokemon/mod.ts";

const PokemonDisplay = (poke: Pokemon) => (
    <div className={tw`flex flex-col justify-self-center justify-center items-center`}>
        <img src={poke.species.imageUrl} width={250} height={250}/>
        <h3>
<<<<<<< HEAD
            {poke.species.name + ' '}
            <small>{poke.species.pokedexNum}</small>
=======
            {poke.species.name}
            <small className={tw`pl-1`}>#{poke.species.pokedexNum}</small>
>>>>>>> 669ae70157136ad67b9f68826931fea20a4cd47d
        </h3>
        <p>Ability: {poke.ability.name}</p>
        <p>Holding: {poke.heldItem}</p>
    </div>
);

export default PokemonDisplay;