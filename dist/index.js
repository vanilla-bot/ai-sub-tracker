#!/usr/bin/env node
import meow from 'meow';
import React from 'react';
import { render } from 'ink';
const cli = meow(`
	Usage
	  $ ai-sub-tracker

	Options
	  --help  Show this help message

	Examples
	  $ ai-sub-tracker
`);
render(React.createElement('div', null, 'AI Sub Tracker'));
//# sourceMappingURL=index.js.map