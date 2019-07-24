import { PullRequest } from "../../services/github";

export const installation = { id: 1319757 };

export const pullRequest: PullRequest = {
  number: 7,
  base: {
    repo: {
      name: "entry",
      owner: { login: "js13kgames" }
    }
  },
  head: {
    ref: "entry/no-release",
    repo: {
      name: "entry",
      owner: { login: "platane" }
    }
  }
} as any;
