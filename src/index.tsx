import { app } from "hyperapp";
import { actions } from "./actions/actions";
import Container from "./components/Container";
import { state } from "./states/state";

app(state, actions, Container, document.body);
