
debug:
	@ELECTRON_RUN_AS_NODE=true node_modules/.bin/electron node_modules/node-inspector/bin/inspector.js

.PHONY: debug
