/// <reference no-default-lib="true"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>
/// <reference lib="esnext"/>

/// <reference path="./ssr-injected.d.ts"/>

import { React, ReactDOM, twSetup } from "../../frontend_deps.ts";
import App from "./app.tsx";
import { Parameters } from "./styling.ts";

twSetup(Parameters);

ReactDOM.hydrate(
    <App pkmn={window.initialPokes}/>,
    document.querySelector("main"),
);