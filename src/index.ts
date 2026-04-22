#!/usr/bin/env node

import meow from 'meow';
import React from 'react';
import { render } from 'ink';
import App from './app';

const cli = meow(`
  Usage
    $ ai-sub-tracker

  Options
    --help  Show this help message
    --plans  Path to plans JSON file (default: ./data/plans.json)
    --usage  Path to usage JSON file (default: ./data/usage.json)

  Examples
    $ ai-sub-tracker
    $ ai-sub-tracker --plans ./my-plans.json --usage ./my-usage.json
`, {
  importMeta: import.meta,
  flags: {
    plans: {
      type: 'string',
      default: './data/plans.json',
    },
    usage: {
      type: 'string',
      default: './data/usage.json',
    },
  },
});

render(React.createElement(App, {
  plansFilePath: cli.flags.plans,
  usageFilePath: cli.flags.usage,
}));
